package com.fileflow.repository;

import com.fileflow.model.FileShare;
import com.fileflow.model.User;
import com.fileflow.model.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileShareRepository extends JpaRepository<FileShare, Long> {
    List<FileShare> findBySharedWith(User user);
    List<FileShare> findByOwner(User user);
    List<FileShare> findByFile(FileEntity file);
    void deleteByFileAndSharedWith(FileEntity file, User sharedWith);
} 