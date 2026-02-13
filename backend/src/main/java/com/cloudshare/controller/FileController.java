package com.cloudshare.controller;

import com.cloudshare.model.FileDocument;
import com.cloudshare.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileDocument> uploadFile(@RequestParam("file") MultipartFile file, Principal principal) {
        // In a real app with Security, principal.getName() would be the user ID
        // For now, we might mock it if security isn't fully set up, or use a header
        String ownerId = principal != null ? principal.getName() : "test-user";
        FileDocument savedFile = fileService.uploadFile(file, ownerId);
        return new ResponseEntity<>(savedFile, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FileDocument>> getFiles(
            Principal principal,
            @RequestParam(value = "name", required = false) String name) {
        String ownerId = principal != null ? principal.getName() : "test-user";
        return ResponseEntity.ok(fileService.getFilesByOwner(ownerId, name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<org.springframework.core.io.Resource> viewFile(
            @PathVariable String id,
            @RequestParam(value = "download", defaultValue = "false") boolean download) {
        FileDocument file = fileService.getFile(id);
        org.springframework.core.io.Resource resource = fileService.loadFileAsResource(file.getUrl());

        String contentType = "application/octet-stream";
        if (file.getType() != null) {
            contentType = file.getType();
        }

        String disposition = download ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        disposition + "; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<FileDocument> togglePublic(@PathVariable String id) {
        FileDocument updatedFile = fileService.togglePublic(id);
        return ResponseEntity.ok(updatedFile);
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<FileDocument> renameFile(@PathVariable String id,
            @RequestBody java.util.Map<String, String> body) {
        String newName = body.get("name");
        FileDocument updatedFile = fileService.renameFile(id, newName);
        return ResponseEntity.ok(updatedFile);
    }
}
