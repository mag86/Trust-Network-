package com.trust.geolocation.entity;

import jakarta.persistence.*;

@Entity
public class GeoPrivacySettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationVisibility visibility = LocationVisibility.APPROXIMATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationSharingRule sharingRule = LocationSharingRule.ALL;

    @Column(nullable = false)
    private Boolean showOnlyWhenOnline = false;

    @Column(nullable = false)
    private Boolean hideWhenInactive = true;

    @Column(nullable = false)
    private Integer inactivityMinutes = 30;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocationVisibility getVisibility() { return visibility; }
    public void setVisibility(LocationVisibility visibility) { this.visibility = visibility; }
    public LocationSharingRule getSharingRule() { return sharingRule; }
    public void setSharingRule(LocationSharingRule sharingRule) { this.sharingRule = sharingRule; }
    public Boolean getShowOnlyWhenOnline() { return showOnlyWhenOnline; }
    public void setShowOnlyWhenOnline(Boolean showOnlyWhenOnline) { this.showOnlyWhenOnline = showOnlyWhenOnline; }
    public Boolean getHideWhenInactive() { return hideWhenInactive; }
    public void setHideWhenInactive(Boolean hideWhenInactive) { this.hideWhenInactive = hideWhenInactive; }
    public Integer getInactivityMinutes() { return inactivityMinutes; }
    public void setInactivityMinutes(Integer inactivityMinutes) { this.inactivityMinutes = inactivityMinutes; }
}

