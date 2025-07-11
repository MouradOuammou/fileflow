package com.fileflow.repository;

import com.fileflow.model.FileEntity;
import com.fileflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByUser(User user);
    List<FileEntity> findByUserAndFilenameContainingIgnoreCase(User user, String filename);
} 