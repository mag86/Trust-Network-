package com.trust.reputation.controller;

import com.trust.reputation.entity.Badge;
import com.trust.reputation.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {
    @Autowired
    private BadgeService badgeService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Badge>> getUserBadges(@PathVariable Long userId) {
        return ResponseEntity.ok(badgeService.getUserBadges(userId));
    }

    @PostMapping("/user/{userId}/check")
    public ResponseEntity<String> checkAndAwardBadges(@PathVariable Long userId) {
        badgeService.checkAndAwardBadges(userId);
        return ResponseEntity.ok("Badges checked");
    }
}

