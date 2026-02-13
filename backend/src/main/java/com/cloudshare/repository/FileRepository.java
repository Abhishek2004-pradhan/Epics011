package com.cloudshare.repository;

import com.cloudshare.model.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends MongoRepository<FileDocument, String> {
    List<FileDocument> findByOwnerId(String ownerId);

    List<FileDocument> findByOwnerIdAndNameContainingIgnoreCase(String ownerId, String name);

    List<FileDocument> findByIsPublicTrue();
}
