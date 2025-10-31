package com.trust.profile.repository;

import com.trust.profile.entity.Tag;
import com.trust.profile.entity.TagType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    List<Tag> findByType(TagType type);
    boolean existsByUserIdAndName(Long userId, String name);
}

