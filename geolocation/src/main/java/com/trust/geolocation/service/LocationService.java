package com.trust.geolocation.service;

import com.trust.geolocation.dto.LocationUpdateRequest;
import com.trust.geolocation.entity.LocationAccuracy;
import com.trust.geolocation.entity.LocationSource;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LocationService {
    @Autowired
    private UserLocationRepository locationRepository;

    @Transactional
    @CacheEvict(value = "userLocations", key = "#userId")
    public UserLocation updateLocation(Long userId, LocationUpdateRequest request) {
        UserLocation location = locationRepository.findByUserId(userId)
                .orElse(new UserLocation());

        boolean isNew = location.getId() == null;
        if (isNew) {
            location.setUserId(userId);
        }

        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setAccuracy(request.getAccuracy() != null ? request.getAccuracy() : LocationAccuracy.MEDIUM);
        location.setSource(request.getSource() != null ? request.getSource() : LocationSource.IP);
        location.setAddress(request.getAddress());
        location.setCity(request.getCity());
        location.setDistrict(request.getDistrict());
        location.setUpdatedAt(LocalDateTime.now());
        location.setLastActiveAt(LocalDateTime.now());

        return locationRepository.save(location);
    }

    @Cacheable(value = "userLocations", key = "#userId", unless = "#result == null")
    public UserLocation getUserLocation(Long userId) {
        return locationRepository.findByUserId(userId).orElse(null);
    }

    @Transactional
    public void updateLastActive(Long userId) {
        UserLocation location = locationRepository.findByUserId(userId).orElse(null);
        if (location != null) {
            location.setLastActiveAt(LocalDateTime.now());
            locationRepository.save(location);
        }
    }
}

