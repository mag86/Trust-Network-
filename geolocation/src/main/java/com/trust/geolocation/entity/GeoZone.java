package com.trust.geolocation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class GeoZone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String name; // "Дом", "Работа", "Публичное место"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ZoneType type;

    @Column(nullable = false)
    private Double centerLatitude;

    @Column(nullable = false)
    private Double centerLongitude;

    @Column(nullable = false)
    private Integer radiusMeters; // Радиус зоны в метрах

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LocationVisibility visibilityInZone;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

