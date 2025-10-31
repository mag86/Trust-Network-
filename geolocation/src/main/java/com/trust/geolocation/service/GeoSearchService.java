package com.trust.geolocation.service;

import com.trust.geolocation.dto.NearbySearchRequest;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeoSearchService {
    @Autowired
    private UserLocationRepository locationRepository;

    @Cacheable(value = "nearbySearch", key = "#request.latitude + '_' + #request.longitude + '_' + #request.radiusMeters", unless = "#result == null || #result.isEmpty()")
    public List<UserLocation> searchNearbyUsers(NearbySearchRequest request) {
        double radiusKm = request.getRadiusMeters() / 1000.0;
        int limit = Math.min(request.getLimit() != null ? request.getLimit() : 20, 100);

        List<UserLocation> results = locationRepository.findNearbyUsers(
                request.getLatitude(),
                request.getLongitude(),
                radiusKm,
                limit
        );

        // TODO: Ранжирование по алгоритму FR2.2.3:
        // - Расстояние (60%)
        // - Релевантность (25%) - совпадение навыков/интересов
        // - Активность (10%) - недавно онлайн
        // - Репутация (5%) - Trust Score

        return results;
    }

    public List<UserLocation> searchNearbyTasks(Double latitude, Double longitude, Integer radiusMeters) {
        // TODO: Интеграция с task модулем для поиска задач поблизости
        return List.of();
    }
}

