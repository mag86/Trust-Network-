package com.trust.geolocation.dto;

import jakarta.validation.constraints.*;

public class NearbySearchRequest {
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;

    @NotNull
    @Min(100)
    @Max(50000)
    private Integer radiusMeters = 1000;

    private Integer limit = 20;

    private Integer page = 0;

    // getters/setters
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Integer getRadiusMeters() { return radiusMeters; }
    public void setRadiusMeters(Integer radiusMeters) { this.radiusMeters = radiusMeters; }
    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }
    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }
}

