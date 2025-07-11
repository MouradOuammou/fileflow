package com.fileflow.service;

import com.fileflow.model.FileEntity;
import com.fileflow.model.FileShare;
import com.fileflow.model.User;
import com.fileflow.repository.FileShareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FileShareService {
    @Autowired
    private FileShareRepository fileShareRepository;

    public FileShare shareFile(FileEntity file, User owner, User sharedWith, String permission) {
        FileShare share = FileShare.builder()
                .file(file)
                .owner(owner)
                .sharedWith(sharedWith)
                .permission(permission)
                .build();
        return fileShareRepository.save(share);
    }

    public List<FileShare> getFilesSharedWith(User user) {
        return fileShareRepository.findBySharedWith(user);
    }

    public List<FileShare> getFilesSharedBy(User user) {
        return fileShareRepository.findByOwner(user);
    }

    public void revokeShare(FileEntity file, User sharedWith) {
        fileShareRepository.deleteByFileAndSharedWith(file, sharedWith);
    }
} 