package com.trust.geolocation.repository;

import com.trust.geolocation.entity.GeoZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeoZoneRepository extends JpaRepository<GeoZone, Long> {
    List<GeoZone> findByUserId(Long userId);
}

