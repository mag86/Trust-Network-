package com.trust.profile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false, length = 50, unique = true)
    private String displayName;

    @Column(length = 500)
    private String avatarUrl;

    @Column(length = 500)
    private String backgroundImageUrl;

    @Column(length = 500)
    private String bio;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String telegram;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrivacyLevel privacyLevel = PrivacyLevel.PUBLIC;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Long viewCount = 0L;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBackgroundImageUrl() { return backgroundImageUrl; }
    public void setBackgroundImageUrl(String backgroundImageUrl) { this.backgroundImageUrl = backgroundImageUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelegram() { return telegram; }
    public void setTelegram(String telegram) { this.telegram = telegram; }
    public PrivacyLevel getPrivacyLevel() { return privacyLevel; }
    public void setPrivacyLevel(PrivacyLevel privacyLevel) { this.privacyLevel = privacyLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
}

