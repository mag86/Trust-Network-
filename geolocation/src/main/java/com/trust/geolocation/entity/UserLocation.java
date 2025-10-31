package com.trust.geolocation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_locations", indexes = {
    @Index(name = "idx_user_id", columnList = "userId"),
    @Index(name = "idx_updated_at", columnList = "updatedAt")
})
public class UserLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationAccuracy accuracy = LocationAccuracy.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationSource source = LocationSource.IP;

    @Column(length = 200)
    private String address; // Форматированный адрес

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String district;

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime lastActiveAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(LocalDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
}

