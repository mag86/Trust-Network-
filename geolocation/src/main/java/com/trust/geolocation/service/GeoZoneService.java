package com.trust.geolocation.service;

import com.trust.geolocation.dto.GeoZoneCreateRequest;
import com.trust.geolocation.entity.GeoZone;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.repository.GeoZoneRepository;
import com.trust.geolocation.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GeoZoneService {
    @Autowired
    private GeoZoneRepository zoneRepository;
    @Autowired
    private UserLocationRepository locationRepository;

    @Transactional
    public GeoZone createZone(Long userId, GeoZoneCreateRequest request) {
        GeoZone zone = new GeoZone();
        zone.setUserId(userId);
        zone.setName(request.getName());
        zone.setType(request.getType());
        zone.setCenterLatitude(request.getCenterLatitude());
        zone.setCenterLongitude(request.getCenterLongitude());
        zone.setRadiusMeters(request.getRadiusMeters());
        zone.setVisibilityInZone(request.getVisibilityInZone());
        zone.setCreatedAt(java.time.LocalDateTime.now());
        return zoneRepository.save(zone);
    }

    public List<GeoZone> getUserZones(Long userId) {
        return zoneRepository.findByUserId(userId);
    }

    @Transactional
    public void deleteZone(Long zoneId, Long userId) {
        GeoZone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new IllegalArgumentException("Зона не найдена"));
        if (!zone.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нельзя удалить чужую зону");
        }
        zoneRepository.delete(zone);
    }

    public GeoZone getZoneForLocation(Long userId, Double latitude, Double longitude) {
        List<GeoZone> zones = zoneRepository.findByUserId(userId);
        for (GeoZone zone : zones) {
            double distance = calculateDistance(
                    latitude, longitude,
                    zone.getCenterLatitude(), zone.getCenterLongitude()
            );
            if (distance <= zone.getRadiusMeters()) {
                return zone;
            }
        }
        return null;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine формула для расчета расстояния в метрах
        final int R = 6371000; // Радиус Земли в метрах
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

