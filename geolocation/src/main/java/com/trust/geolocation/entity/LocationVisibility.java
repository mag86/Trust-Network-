package com.trust.geolocation.entity;

public enum LocationVisibility {
    EXACT,         // Точное - координаты с высокой точностью
    APPROXIMATE,   // Приблизительное - район/квартал (500m радиус)
    CITY_ONLY,     // Городское - только город/район города
    HIDDEN         // Скрытое - локация полностью скрыта
}

