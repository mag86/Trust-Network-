package com.trust.profile.entity;

import jakarta.persistence.*;

@Entity
public class PrivacySettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisibilityLevel contactsVisibility = VisibilityLevel.ALL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisibilityLevel taskStatsVisibility = VisibilityLevel.ALL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisibilityLevel reviewsVisibility = VisibilityLevel.ALL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisibilityLevel locationVisibility = VisibilityLevel.ALL;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public VisibilityLevel getContactsVisibility() { return contactsVisibility; }
    public void setContactsVisibility(VisibilityLevel contactsVisibility) { this.contactsVisibility = contactsVisibility; }
    public VisibilityLevel getTaskStatsVisibility() { return taskStatsVisibility; }
    public void setTaskStatsVisibility(VisibilityLevel taskStatsVisibility) { this.taskStatsVisibility = taskStatsVisibility; }
    public VisibilityLevel getReviewsVisibility() { return reviewsVisibility; }
    public void setReviewsVisibility(VisibilityLevel reviewsVisibility) { this.reviewsVisibility = reviewsVisibility; }
    public VisibilityLevel getLocationVisibility() { return locationVisibility; }
    public void setLocationVisibility(VisibilityLevel locationVisibility) { this.locationVisibility = locationVisibility; }
}

