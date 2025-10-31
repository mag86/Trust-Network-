package com.trust.profile.repository;

import com.trust.profile.entity.UserBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {
    boolean existsByBlockerUserIdAndBlockedUserId(Long blockerId, Long blockedId);
    Optional<UserBlock> findByBlockerUserIdAndBlockedUserId(Long blockerId, Long blockedId);
    List<UserBlock> findByBlockerUserId(Long blockerId);
}

