package com.trust.geolocation.dto;

import jakarta.validation.constraints.*;
import com.trust.geolocation.entity.LocationAccuracy;
import com.trust.geolocation.entity.LocationSource;

public class LocationUpdateRequest {
    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;

    private LocationAccuracy accuracy;
    private LocationSource source;
    private String address;
    private String city;
    private String district;

    // getters/setters
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public LocationAccuracy getAccuracy() { return accuracy; }
    public void setAccuracy(LocationAccuracy accuracy) { this.accuracy = accuracy; }
    public LocationSource getSource() { return source; }
    public void setSource(LocationSource source) { this.source = source; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
}

