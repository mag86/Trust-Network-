package com.trust.reputation.repository;

import com.trust.reputation.entity.Badge;
import com.trust.reputation.entity.BadgeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUserId(Long userId);
    List<Badge> findByUserIdAndType(Long userId, BadgeType type);
    boolean existsByUserIdAndTypeAndName(Long userId, BadgeType type, String name);
}

