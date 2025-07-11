package com.fileflow.service;

import com.fileflow.model.Folder;
import com.fileflow.model.User;
import com.fileflow.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FolderService {
    @Autowired
    private FolderRepository folderRepository;

    public Folder createFolder(String name, User user, Folder parent) {
        Folder folder = Folder.builder()
                .name(name)
                .user(user)
                .parent(parent)
                .build();
        return folderRepository.save(folder);
    }

    public List<Folder> getRootFolders(User user) {
        return folderRepository.findByUserAndParentIsNull(user);
    }

    public List<Folder> getSubfolders(Folder parent) {
        return folderRepository.findByParent(parent);
    }

    public Optional<Folder> getById(Long id) {
        return folderRepository.findById(id);
    }

    public void deleteFolder(Folder folder) {
        folderRepository.delete(folder);
    }

    public Folder save(Folder folder) {
        return folderRepository.save(folder);
    }
} 