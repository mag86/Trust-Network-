package com.trust.geolocation.controller;

import com.trust.geolocation.dto.GeoZoneCreateRequest;
import com.trust.geolocation.entity.GeoZone;
import com.trust.geolocation.service.GeoZoneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geo/zones")
public class GeoZoneController {
    @Autowired
    private GeoZoneService zoneService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<GeoZone>> getUserZones(@PathVariable Long userId) {
        return ResponseEntity.ok(zoneService.getUserZones(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<GeoZone> createZone(@PathVariable Long userId,
                                              @Valid @RequestBody GeoZoneCreateRequest request) {
        GeoZone zone = zoneService.createZone(userId, request);
        return ResponseEntity.ok(zone);
    }

    @DeleteMapping("/{zoneId}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long zoneId,
                                            @RequestParam Long userId) {
        zoneService.deleteZone(zoneId, userId);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

