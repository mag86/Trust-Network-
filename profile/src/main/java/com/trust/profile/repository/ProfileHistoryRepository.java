package com.trust.profile.repository;

import com.trust.profile.entity.ProfileHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProfileHistoryRepository extends JpaRepository<ProfileHistory, Long> {
    List<ProfileHistory> findByUserIdAndChangedAtAfter(Long userId, LocalDateTime date);
    List<ProfileHistory> findByUserIdOrderByChangedAtDesc(Long userId);
}

