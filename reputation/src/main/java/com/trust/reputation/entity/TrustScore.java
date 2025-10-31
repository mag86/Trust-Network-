package com.trust.reputation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class TrustScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    // Факторы влияния (FR6.2.1)
    @Column(nullable = false)
    private Double completionRate; // 25%

    @Column(nullable = false)
    private Double averageRating; // 30%

    @Column(nullable = false)
    private Double responseRate; // 15%

    @Column(nullable = false)
    private Double transactionVolume; // 10%

    @Column(nullable = false)
    private Double accountAge; // 5%

    @Column(nullable = false)
    private Double verificationLevel; // 10%

    @Column(nullable = false)
    private Double communityEndorsements; // 5%

    // Итоговый Trust Score (0-100)
    @Column(nullable = false)
    private Double score;

    @Column(nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();

    // Уровень репутации (FR6.3.1)
    @Enumerated(EnumType.STRING)
    private ReputationLevel level;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Double getResponseRate() { return responseRate; }
    public void setResponseRate(Double responseRate) { this.responseRate = responseRate; }
    public Double getTransactionVolume() { return transactionVolume; }
    public void setTransactionVolume(Double transactionVolume) { this.transactionVolume = transactionVolume; }
    public Double getAccountAge() { return accountAge; }
    public void setAccountAge(Double accountAge) { this.accountAge = accountAge; }
    public Double getVerificationLevel() { return verificationLevel; }
    public void setVerificationLevel(Double verificationLevel) { this.verificationLevel = verificationLevel; }
    public Double getCommunityEndorsements() { return communityEndorsements; }
    public void setCommunityEndorsements(Double communityEndorsements) { this.communityEndorsements = communityEndorsements; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    public ReputationLevel getLevel() { return level; }
    public void setLevel(ReputationLevel level) { this.level = level; }
}

