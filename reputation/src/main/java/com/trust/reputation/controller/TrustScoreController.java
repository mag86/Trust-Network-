package com.trust.reputation.controller;

import com.trust.reputation.entity.TrustScore;
import com.trust.reputation.service.TrustScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trust-score")
public class TrustScoreController {
    @Autowired
    private TrustScoreService trustScoreService;

    @GetMapping("/{userId}")
    public ResponseEntity<TrustScore> getTrustScore(@PathVariable Long userId) {
        TrustScore score = trustScoreService.calculateAndUpdateTrustScore(userId);
        return ResponseEntity.ok(score);
    }

    @PostMapping("/{userId}/recalculate")
    public ResponseEntity<TrustScore> recalculateTrustScore(@PathVariable Long userId) {
        TrustScore score = trustScoreService.calculateAndUpdateTrustScore(userId);
        return ResponseEntity.ok(score);
    }
}

