package com.fileflow.controller;

import com.fileflow.model.FileEntity;
import com.fileflow.model.FileShare;
import com.fileflow.model.User;
import com.fileflow.repository.FileRepository;
import com.fileflow.repository.UserRepository;
import com.fileflow.service.FileShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileShareController {
    @Autowired
    private FileShareService fileShareService;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareFile(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User owner = getCurrentUser();
        FileEntity file = fileRepository.findById(id).orElseThrow();
        if (!file.getUser().getId().equals(owner.getId())) {
            return ResponseEntity.status(403).body("Not your file");
        }
        String username = body.get("username");
        String permission = body.getOrDefault("permission", "READ");
        User sharedWith = userRepository.findByUsername(username).orElse(null);
        if (sharedWith == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        FileShare share = fileShareService.shareFile(file, owner, sharedWith, permission);
        return ResponseEntity.ok(share);
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<List<FileShare>> filesSharedWithMe() {
        User user = getCurrentUser();
        return ResponseEntity.ok(fileShareService.getFilesSharedWith(user));
    }

    @DeleteMapping("/{id}/share/{userId}")
    public ResponseEntity<?> revokeShare(@PathVariable Long id, @PathVariable Long userId) {
        User owner = getCurrentUser();
        FileEntity file = fileRepository.findById(id).orElseThrow();
        if (!file.getUser().getId().equals(owner.getId())) {
            return ResponseEntity.status(403).body("Not your file");
        }
        User sharedWith = userRepository.findById(userId).orElse(null);
        if (sharedWith == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        fileShareService.revokeShare(file, sharedWith);
        return ResponseEntity.ok().build();
    }
} 