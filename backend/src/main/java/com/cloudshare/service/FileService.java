package com.cloudshare.service;

import com.cloudshare.model.FileDocument;
import com.cloudshare.repository.FileRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    // Initialize storage
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileDocument uploadFile(MultipartFile file, String ownerId) {
        // Check if filename contains invalid characters
        String fileName = org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            // For production, use UUID to prevent overwritten files or S3
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileDocument newFile = new FileDocument();
            newFile.setName(fileName);
            newFile.setSize(file.getSize());
            newFile.setType(file.getContentType());
            // Set URL to API endpoint for serving
            newFile.setUrl(targetLocation.getFileName().toString());
            newFile.setOwnerId(ownerId);
            newFile.setPublic(false);

            FileDocument savedFile = fileRepository.save(newFile);
            transformFile(savedFile);
            return savedFile;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    public List<FileDocument> getFilesByOwner(String ownerId, String name) {
        List<FileDocument> files;
        if (name != null && !name.isEmpty()) {
            files = fileRepository.findByOwnerIdAndNameContainingIgnoreCase(ownerId, name);
        } else {
            files = fileRepository.findByOwnerId(ownerId);
        }

        // Sort by creation date descending by default
        files.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        files.forEach(this::transformFile);
        return files;
    }

    private void transformFile(FileDocument file) {
        String id = file.getId();
        // Return a viewable URL for the frontend
        file.setUrl("http://localhost:8085/api/files/" + id + "/view");
    }

    public void deleteFile(String id) {
        FileDocument file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        try {
            // file.getUrl() stores the filename in the DB
            Path fileToDeletePath = this.fileStorageLocation.resolve(file.getUrl());
            Files.deleteIfExists(fileToDeletePath);
        } catch (IOException e) {
            System.err.println("Could not delete file from disk: " + e.getMessage());
        }
        fileRepository.deleteById(id);
    }

    public FileDocument getFile(String id) {
        return fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found " + id));
    }

    public FileDocument togglePublic(String id) {
        FileDocument file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        file.setPublic(!file.isPublic());
        FileDocument savedFile = fileRepository.save(file);
        transformFile(savedFile);
        return savedFile;
    }

    public FileDocument renameFile(String id, String newName) {
        FileDocument file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        file.setName(newName);
        FileDocument savedFile = fileRepository.save(file);
        transformFile(savedFile);
        return savedFile;
    }
}
