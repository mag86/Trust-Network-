package com.trust.profile.dto;

import com.trust.profile.entity.VisibilityLevel;

public class PrivacySettingsUpdateRequest {
    private VisibilityLevel contactsVisibility;
    private VisibilityLevel taskStatsVisibility;
    private VisibilityLevel reviewsVisibility;
    private VisibilityLevel locationVisibility;

    // getters/setters
    public VisibilityLevel getContactsVisibility() { return contactsVisibility; }
    public void setContactsVisibility(VisibilityLevel contactsVisibility) { this.contactsVisibility = contactsVisibility; }
    public VisibilityLevel getTaskStatsVisibility() { return taskStatsVisibility; }
    public void setTaskStatsVisibility(VisibilityLevel taskStatsVisibility) { this.taskStatsVisibility = taskStatsVisibility; }
    public VisibilityLevel getReviewsVisibility() { return reviewsVisibility; }
    public void setReviewsVisibility(VisibilityLevel reviewsVisibility) { this.reviewsVisibility = reviewsVisibility; }
    public VisibilityLevel getLocationVisibility() { return locationVisibility; }
    public void setLocationVisibility(VisibilityLevel locationVisibility) { this.locationVisibility = locationVisibility; }
}

