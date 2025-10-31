package com.trust.geolocation.controller;

import com.trust.geolocation.dto.LocationUpdateRequest;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Geolocation", description = "API для работы с геолокацией пользователей и поиска объектов поблизости")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserLocation> getLocation(@PathVariable Long userId) {
        UserLocation location = locationService.getUserLocation(userId);
        return location != null ? ResponseEntity.ok(location) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserLocation> updateLocation(@PathVariable Long userId,
                                                       @Valid @RequestBody LocationUpdateRequest request) {
        UserLocation location = locationService.updateLocation(userId, request);
        return ResponseEntity.ok(location);
    }

    @PostMapping("/{userId}/active")
    public ResponseEntity<Void> updateLastActive(@PathVariable Long userId) {
        locationService.updateLastActive(userId);
        return ResponseEntity.ok().build();
    }
}

