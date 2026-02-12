package com.cloudshare.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "files")
public class FileDocument {
    @Id
    private String id;
    private String name;
    private String type;
    private long size;
    private String url; // Could be S3 URL or GridFS ID
    private String ownerId; // Clerk User ID
    private boolean isPublic;
    private LocalDateTime createdAt = LocalDateTime.now();
}
