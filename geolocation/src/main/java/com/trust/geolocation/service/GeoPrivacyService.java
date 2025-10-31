package com.trust.geolocation.service;

import com.trust.geolocation.dto.GeoPrivacySettingsUpdateRequest;
import com.trust.geolocation.entity.GeoPrivacySettings;
import com.trust.geolocation.entity.LocationVisibility;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.repository.GeoPrivacySettingsRepository;
import com.trust.geolocation.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class GeoPrivacyService {
    @Autowired
    private GeoPrivacySettingsRepository privacyRepository;
    @Autowired
    private UserLocationRepository locationRepository;

    @Transactional
    public GeoPrivacySettings updatePrivacySettings(Long userId, GeoPrivacySettingsUpdateRequest request) {
        GeoPrivacySettings settings = privacyRepository.findByUserId(userId)
                .orElse(new GeoPrivacySettings());

        if (settings.getId() == null) {
            settings.setUserId(userId);
        }

        if (request.getVisibility() != null) {
            settings.setVisibility(request.getVisibility());
        }
        if (request.getSharingRule() != null) {
            settings.setSharingRule(request.getSharingRule());
        }
        if (request.getShowOnlyWhenOnline() != null) {
            settings.setShowOnlyWhenOnline(request.getShowOnlyWhenOnline());
        }
        if (request.getHideWhenInactive() != null) {
            settings.setHideWhenInactive(request.getHideWhenInactive());
        }
        if (request.getInactivityMinutes() != null) {
            settings.setInactivityMinutes(request.getInactivityMinutes());
        }

        return privacyRepository.save(settings);
    }

    public GeoPrivacySettings getPrivacySettings(Long userId) {
        return privacyRepository.findByUserId(userId)
                .orElse(new GeoPrivacySettings()); // По умолчанию
    }

    public UserLocation getLocationWithPrivacy(Long userId, Long requesterId) {
        UserLocation location = locationRepository.findByUserId(userId).orElse(null);
        if (location == null) return null;

        GeoPrivacySettings settings = getPrivacySettings(userId);

        // Проверка правил видимости (FR2.3.2)
        if (settings.getVisibility() == LocationVisibility.HIDDEN) {
            return null;
        }

        // Проверка активности (FR2.3.2)
        if (settings.getHideWhenInactive()) {
            Duration inactive = Duration.between(location.getLastActiveAt(), LocalDateTime.now());
            if (inactive.toMinutes() > settings.getInactivityMinutes()) {
                return null;
            }
        }

        // Применение уровня точности согласно настройкам приватности (FR2.3.1)
        return applyPrivacyLevel(location, settings.getVisibility());
    }

    private UserLocation applyPrivacyLevel(UserLocation location, LocationVisibility visibility) {
        if (visibility == LocationVisibility.EXACT) {
            return location;
        } else if (visibility == LocationVisibility.APPROXIMATE) {
            // Приблизительное - округляем координаты (500m радиус)
            UserLocation approximate = new UserLocation();
            approximate.setUserId(location.getUserId());
            approximate.setLatitude(Math.round(location.getLatitude() * 1000.0) / 1000.0); // ~111m точность
            approximate.setLongitude(Math.round(location.getLongitude() * 1000.0) / 1000.0);
            approximate.setCity(location.getCity());
            approximate.setDistrict(location.getDistrict());
            return approximate;
        } else if (visibility == LocationVisibility.CITY_ONLY) {
            // Только город
            UserLocation cityOnly = new UserLocation();
            cityOnly.setUserId(location.getUserId());
            cityOnly.setCity(location.getCity());
            cityOnly.setDistrict(location.getDistrict());
            return cityOnly;
        }
        return null; // HIDDEN
    }
}

