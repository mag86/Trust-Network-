package com.trust.profile.controller;

import com.trust.profile.dto.ProfileUpdateRequest;
import com.trust.profile.entity.UserProfile;
import com.trust.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profiles", description = "API для управления профилями пользователей, навыками и настройками приватности")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        profileService.incrementViewCount(userId); // FR3.1.3: статистика просмотров
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long userId,
                                                     @Valid @RequestBody ProfileUpdateRequest request) {
        UserProfile profile = profileService.createOrUpdateProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

