package com.trust.geolocation.dto;

import com.trust.geolocation.entity.LocationVisibility;
import com.trust.geolocation.entity.LocationSharingRule;

public class GeoPrivacySettingsUpdateRequest {
    private LocationVisibility visibility;
    private LocationSharingRule sharingRule;
    private Boolean showOnlyWhenOnline;
    private Boolean hideWhenInactive;
    private Integer inactivityMinutes;

    // getters/setters
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

