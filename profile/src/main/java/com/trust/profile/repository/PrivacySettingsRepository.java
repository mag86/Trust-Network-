package com.trust.profile.repository;

import com.trust.profile.entity.PrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
    Optional<PrivacySettings> findByUserId(Long userId);
}

