package com.trust.profile.controller;

import com.trust.profile.dto.PrivacySettingsUpdateRequest;
import com.trust.profile.entity.PrivacySettings;
import com.trust.profile.service.PrivacyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/{userId}/privacy")
public class PrivacyController {
    @Autowired
    private PrivacyService privacyService;

    @GetMapping
    public ResponseEntity<PrivacySettings> getPrivacySettings(@PathVariable Long userId) {
        return ResponseEntity.ok(privacyService.getPrivacySettings(userId));
    }

    @PutMapping
    public ResponseEntity<PrivacySettings> updatePrivacySettings(@PathVariable Long userId,
                                                                 @RequestBody PrivacySettingsUpdateRequest request) {
        PrivacySettings settings = privacyService.updatePrivacySettings(userId, request);
        return ResponseEntity.ok(settings);
    }
}

