package com.trust.geolocation.entity;

public enum LocationAccuracy {
    HIGH(50),      // ≤ 50m - для точных встреч и доставки
    MEDIUM(500),   // ≤ 500m - для поиска в районе
    LOW(5000),     // ≤ 5km - для городского поиска
    CITY(50000);   // ≤ 50km - для регионального поиска

    private final int maxRadiusMeters;

    LocationAccuracy(int maxRadiusMeters) {
        this.maxRadiusMeters = maxRadiusMeters;
    }

    public int getMaxRadiusMeters() {
        return maxRadiusMeters;
    }
}

