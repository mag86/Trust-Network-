package com.trust.geolocation.entity;

public enum LocationSource {
    GPS,           // GPS/GLONASS - высокая точность (5-50 метров)
    WIFI,          // Wi-Fi positioning - средняя точность (50-200 метров)
    CELL_TOWER,    // Cell tower triangulation - низкая точность (200-2000 метров)
    IP             // IP geolocation - базовая локализация (городской уровень)
}

