package com.fileflow.controller;

import com.fileflow.model.Folder;
import com.fileflow.model.User;
import com.fileflow.repository.UserRepository;
import com.fileflow.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Folder> createFolder(@RequestBody Map<String, Object> body) {
        User user = getCurrentUser();
        String name = (String) body.get("name");
        Long parentId = body.get("parentId") != null ? Long.valueOf(body.get("parentId").toString()) : null;
        Folder parent = null;
        if (parentId != null) {
            parent = folderService.getById(parentId).orElse(null);
        }
        Folder folder = folderService.createFolder(name, user, parent);
        return ResponseEntity.ok(folder);
    }

    @GetMapping
    public ResponseEntity<List<Folder>> listRootFolders() {
        User user = getCurrentUser();
        return ResponseEntity.ok(folderService.getRootFolders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFolderContent(@PathVariable Long id) {
        Folder folder = folderService.getById(id).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "subfolders", folderService.getSubfolders(folder)
        ));
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<Folder> renameFolder(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Folder folder = folderService.getById(id).orElseThrow();
        folder.setName(body.get("newName"));
        return ResponseEntity.ok(folderService.save(folder));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFolder(@PathVariable Long id) {
        Folder folder = folderService.getById(id).orElseThrow();
        folderService.deleteFolder(folder);
        return ResponseEntity.ok().build();
    }
} 