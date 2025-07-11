package com.fileflow.service;

import com.fileflow.model.FileEntity;
import com.fileflow.model.User;
import com.fileflow.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;

    @Value("${fileflow.storage.path:uploads}")
    private String storagePath;

    public FileEntity storeFile(MultipartFile file, User user) throws IOException {
        Path userDir = Paths.get(storagePath, user.getUsername());
        Files.createDirectories(userDir);
        Path filePath = userDir.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath);
        FileEntity fileEntity = FileEntity.builder()
                .filename(file.getOriginalFilename())
                .size(file.getSize())
                .mimeType(file.getContentType())
                .storagePath(filePath.toString())
                .uploadDate(LocalDateTime.now())
                .user(user)
                .build();
        return fileRepository.save(fileEntity);
    }

    public List<FileEntity> getFilesByUser(User user) {
        return fileRepository.findByUser(user);
    }

    public Optional<FileEntity> getFileById(Long id) {
        return fileRepository.findById(id);
    }

    public void deleteFile(FileEntity fileEntity) throws IOException {
        Files.deleteIfExists(Paths.get(fileEntity.getStoragePath()));
        fileRepository.delete(fileEntity);
    }

    public List<FileEntity> searchFiles(User user, String query) {
        return fileRepository.findByUserAndFilenameContainingIgnoreCase(user, query);
    }

    public FileEntity save(FileEntity fileEntity) {
        return fileRepository.save(fileEntity);
    }
} 