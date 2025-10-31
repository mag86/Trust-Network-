package com.trust.geolocation.entity;

public enum ZoneType {
    HOME,          // Дом - всегда точная локация
    WORK,          // Работа - всегда точная локация
    PUBLIC_PLACE,  // Публичные места - приблизительная локация
    UNKNOWN_AREA   // Незнакомые районы - скрытая локация
}

