package com.trust.profile.dto;

import jakarta.validation.constraints.*;
import com.trust.profile.entity.PrivacyLevel;

public class ProfileUpdateRequest {
    @Size(min = 2, max = 50)
    private String displayName;

    @Size(max = 500)
    private String bio;

    @Size(max = 100)
    private String email;

    @Size(max = 100)
    private String telegram;

    private String avatarUrl;
    private String backgroundImageUrl;
    private PrivacyLevel privacyLevel;

    // getters/setters
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelegram() { return telegram; }
    public void setTelegram(String telegram) { this.telegram = telegram; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBackgroundImageUrl() { return backgroundImageUrl; }
    public void setBackgroundImageUrl(String backgroundImageUrl) { this.backgroundImageUrl = backgroundImageUrl; }
    public PrivacyLevel getPrivacyLevel() { return privacyLevel; }
    public void setPrivacyLevel(PrivacyLevel privacyLevel) { this.privacyLevel = privacyLevel; }
}

