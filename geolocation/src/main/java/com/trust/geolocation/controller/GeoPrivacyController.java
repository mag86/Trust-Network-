package com.trust.geolocation.controller;

import com.trust.geolocation.dto.GeoPrivacySettingsUpdateRequest;
import com.trust.geolocation.entity.GeoPrivacySettings;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.service.GeoPrivacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/geo/privacy")
public class GeoPrivacyController {
    @Autowired
    private GeoPrivacyService privacyService;

    @GetMapping("/{userId}")
    public ResponseEntity<GeoPrivacySettings> getPrivacySettings(@PathVariable Long userId) {
        return ResponseEntity.ok(privacyService.getPrivacySettings(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<GeoPrivacySettings> updatePrivacySettings(@PathVariable Long userId,
                                                                     @RequestBody GeoPrivacySettingsUpdateRequest request) {
        GeoPrivacySettings settings = privacyService.updatePrivacySettings(userId, request);
        return ResponseEntity.ok(settings);
    }

    @GetMapping("/{userId}/location")
    public ResponseEntity<UserLocation> getLocationWithPrivacy(@PathVariable Long userId,
                                                                @RequestParam Long requesterId) {
        UserLocation location = privacyService.getLocationWithPrivacy(userId, requesterId);
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();
    }
}

