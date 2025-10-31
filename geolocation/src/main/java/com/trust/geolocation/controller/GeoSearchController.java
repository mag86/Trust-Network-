package com.trust.geolocation.controller;

import com.trust.geolocation.dto.NearbySearchRequest;
import com.trust.geolocation.entity.UserLocation;
import com.trust.geolocation.service.GeoSearchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geo/search")
public class GeoSearchController {
    @Autowired
    private GeoSearchService searchService;

    @PostMapping("/nearby-users")
    public ResponseEntity<List<UserLocation>> searchNearbyUsers(@Valid @RequestBody NearbySearchRequest request) {
        List<UserLocation> results = searchService.searchNearbyUsers(request);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/nearby-users")
    public ResponseEntity<List<UserLocation>> searchNearbyUsersGet(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "1000") Integer radiusMeters,
            @RequestParam(defaultValue = "20") Integer limit) {
        NearbySearchRequest request = new NearbySearchRequest();
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setRadiusMeters(radiusMeters);
        request.setLimit(limit);
        List<UserLocation> results = searchService.searchNearbyUsers(request);
        return ResponseEntity.ok(results);
    }
}

