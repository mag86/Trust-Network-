package com.trust.reputation.service;

import com.trust.reputation.entity.ReputationLevel;
import com.trust.reputation.entity.TrustScore;
import com.trust.reputation.repository.ReviewRepository;
import com.trust.reputation.repository.TrustScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrustScoreService {
    @Autowired
    private TrustScoreRepository trustScoreRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public TrustScore calculateAndUpdateTrustScore(Long userId) {
        TrustScore trustScore = trustScoreRepository.findByUserId(userId)
                .orElse(new TrustScore());

        // Расчет факторов (FR6.2.1)
        // TODO: интеграция с другими модулями для получения реальных данных
        double completionRate = calculateCompletionRate(userId); // 25%
        double averageRating = calculateAverageRating(userId); // 30%
        double responseRate = calculateResponseRate(userId); // 15%
        double transactionVolume = calculateTransactionVolume(userId); // 10%
        double accountAge = calculateAccountAge(userId); // 5%
        double verificationLevel = calculateVerificationLevel(userId); // 10%
        double communityEndorsements = calculateCommunityEndorsements(userId); // 5%

        // Динамическое взвешивание (FR6.2.2)
        // TODO: логика для новых/активных пользователей

        // Итоговый расчет (0-100)
        double score = completionRate * 0.25 +
                averageRating * 0.30 +
                responseRate * 0.15 +
                transactionVolume * 0.10 +
                accountAge * 0.05 +
                verificationLevel * 0.10 +
                communityEndorsements * 0.05;

        // Защита от манипуляций (FR6.2.3) - кап на ежедневное изменение ±5 пунктов
        if (trustScore.getScore() != null) {
            double change = score - trustScore.getScore();
            if (Math.abs(change) > 5.0) {
                score = trustScore.getScore() + (change > 0 ? 5.0 : -5.0);
            }
        }

        trustScore.setUserId(userId);
        trustScore.setCompletionRate(completionRate);
        trustScore.setAverageRating(averageRating);
        trustScore.setResponseRate(responseRate);
        trustScore.setTransactionVolume(transactionVolume);
        trustScore.setAccountAge(accountAge);
        trustScore.setVerificationLevel(verificationLevel);
        trustScore.setCommunityEndorsements(communityEndorsements);
        trustScore.setScore(score);
        trustScore.setLevel(ReputationLevel.fromScore(score));
        trustScore.setLastUpdated(java.time.LocalDateTime.now());

        return trustScoreRepository.save(trustScore);
    }

    // Stub методы - будут заменены реальными интеграциями
    private double calculateCompletionRate(Long userId) {
        // TODO: интеграция с task модулем
        return 80.0; // placeholder
    }

    private double calculateAverageRating(Long userId) {
        return reviewRepository.findByTargetUserId(userId).stream()
                .mapToDouble(r -> r.getOverallRating() * 20.0) // 5.0 -> 100.0
                .average()
                .orElse(50.0); // default средний
    }

    private double calculateResponseRate(Long userId) {
        // TODO: интеграция с коммуникациями
        return 85.0; // placeholder
    }

    private double calculateTransactionVolume(Long userId) {
        // TODO: интеграция с credit модулем
        return 60.0; // placeholder
    }

    private double calculateAccountAge(Long userId) {
        // TODO: интеграция с user модулем
        return 70.0; // placeholder
    }

    private double calculateVerificationLevel(Long userId) {
        // TODO: интеграция с auth модулем
        return 90.0; // placeholder
    }

    private double calculateCommunityEndorsements(Long userId) {
        // TODO: интеграция с community features
        return 50.0; // placeholder
    }
}

