package com.trust.geolocation.repository;

import com.trust.geolocation.entity.GeoPrivacySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GeoPrivacySettingsRepository extends JpaRepository<GeoPrivacySettings, Long> {
    Optional<GeoPrivacySettings> findByUserId(Long userId);
}

