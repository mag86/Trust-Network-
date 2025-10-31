package com.trust.geolocation.dto;

import jakarta.validation.constraints.*;
import com.trust.geolocation.entity.ZoneType;
import com.trust.geolocation.entity.LocationVisibility;

public class GeoZoneCreateRequest {
    @NotBlank
    @Size(max = 50)
    private String name;

    @NotNull
    private ZoneType type;

    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double centerLatitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double centerLongitude;

    @NotNull
    @Min(100)
    @Max(10000)
    private Integer radiusMeters;

    @NotNull
    private LocationVisibility visibilityInZone;

    // getters/setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ZoneType getType() { return type; }
    public void setType(ZoneType type) { this.type = type; }
    public Double getCenterLatitude() { return centerLatitude; }
    public void setCenterLatitude(Double centerLatitude) { this.centerLatitude = centerLatitude; }
    public Double getCenterLongitude() { return centerLongitude; }
    public void setCenterLongitude(Double centerLongitude) { this.centerLongitude = centerLongitude; }
    public Integer getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Integer radiusMeters) { this.radiusMeters = radiusMeters; }
    public LocationVisibility getVisibilityInZone() { return visibilityInZone; }
    public void setVisibilityInZone(LocationVisibility visibilityInZone) { this.visibilityInZone = visibilityInZone; }
}

