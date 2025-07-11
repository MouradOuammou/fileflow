package com.fileflow.repository;

import com.fileflow.model.Folder;
import com.fileflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserAndParentIsNull(User user);
    List<Folder> findByParent(Folder parent);
    List<Folder> findByUser(User user);
} 