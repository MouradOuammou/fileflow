package com.fileflow.controller;

import com.fileflow.model.FileEntity;
import com.fileflow.model.User;
import com.fileflow.repository.UserRepository;
import com.fileflow.service.FileService;
import com.fileflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService fileService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        User user = getCurrentUser();
        FileEntity saved = fileService.storeFile(file, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<FileEntity>> listFiles() {
        User user = getCurrentUser();
        return ResponseEntity.ok(fileService.getFilesByUser(user));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FileEntity>> searchFiles(@RequestParam String query) {
        User user = getCurrentUser();
        return ResponseEntity.ok(fileService.searchFiles(user, query));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        User user = getCurrentUser();
        FileEntity file = fileService.getFileById(id).orElseThrow();
        if (!file.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        Resource resource = new FileSystemResource(file.getStoragePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) throws IOException {
        User user = getCurrentUser();
        FileEntity file = fileService.getFileById(id).orElseThrow();
        if (!file.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not your file");
        }
        fileService.deleteFile(file);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<?> renameFile(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        User user = getCurrentUser();
        FileEntity file = fileService.getFileById(id).orElseThrow();
        if (!file.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not your file");
        }
        String newName = body.get("newName");
        file.setFilename(newName);
        fileService.save(file);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/stats/space")
    public ResponseEntity<Long> getUsedSpace() {
        User user = getCurrentUser();
        List<FileEntity> files = fileService.getFilesByUser(user);
        long used = files.stream().mapToLong(FileEntity::getSize).sum();
        return ResponseEntity.ok(used);
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getFileCount() {
        User user = getCurrentUser();
        long count = fileService.getFilesByUser(user).size();
        return ResponseEntity.ok(count);
    }
} 