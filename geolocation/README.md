# 🗺️ Модуль Геолокации (Geolocation)

Модуль предоставляет функциональность для работы с местоположением пользователей, поиска nearby-объектов и геопространственных вычислений.

## 📋 Функциональные возможности

### FR2.1: Определение местоположения
- Источники: GPS (5-50м), Wi-Fi (50-200м), Cell Tower (200-2000м), IP (городской уровень)
- Уровни точности: HIGH (≤50м), MEDIUM (≤500м), LOW (≤5км), CITY (≤50км)
- Частота обновления: реальное время, периодическое (15 мин), по запросу

### FR2.2: Поиск объектов в радиусе
- Поиск пользователей поблизости
- Поиск активных задач поблизости
- Радиус поиска: 100м - 50км
- Пагинация: до 20 результатов на страницу
- Ранжирование: расстояние (60%), релевантность (25%), активность (10%), репутация (5%)

### FR2.3: Настройки приватности
- Уровни видимости: Точное, Приблизительное, Городское, Скрытое
- Гранулярный контроль: кому показывать, временные ограничения
- Автоматическое скрытие при бездействии
- Гео-зоны: дом/работа (точная), публичные места (приблизительная), незнакомые районы (скрытая)

### FR2.4: Кэширование и оптимизация
- Кэш координат пользователей (5 минут TTL)
- Кэш результатов поиска (2 минуты TTL)
- Кэш гео-зон (24 часа TTL)
- Оптимизированные запросы с пространственными индексами

## 🚀 API Endpoints

### Управление местоположением

#### GET `/api/locations/{userId}`
Получить текущее местоположение пользователя

**Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "latitude": 55.7558,
  "longitude": 37.6173,
  "accuracy": "HIGH",
  "source": "GPS",
  "address": "Москва, Красная площадь, 1",
  "city": "Москва",
  "district": "Центральный",
  "updatedAt": "2025-10-31T22:00:00",
  "lastActiveAt": "2025-10-31T22:00:00"
}
```

#### PUT `/api/locations/{userId}`
Обновить местоположение

**Request Body:**
```json
{
  "latitude": 55.7558,
  "longitude": 37.6173,
  "accuracy": "HIGH",
  "source": "GPS",
  "address": "Москва, Красная площадь, 1",
  "city": "Москва",
  "district": "Центральный"
}
```

#### POST `/api/locations/{userId}/active`
Обновить время последней активности

### Поиск поблизости

#### POST `/api/geo/search/nearby-users`
Поиск пользователей поблизости

**Request Body:**
```json
{
  "latitude": 55.7558,
  "longitude": 37.6173,
  "radiusMeters": 1000,
  "limit": 20,
  "page": 0
}
```

**Response:** 200 OK
```json
[
  {
    "id": 2,
    "userId": 2,
    "latitude": 55.7560,
    "longitude": 37.6175,
    "accuracy": "HIGH",
    "distance": 250.5,
    "address": "Москва, ул. Тверская, 10"
  }
]
```

#### GET `/api/geo/search/nearby-users`
Поиск пользователей (GET вариант)

**Query Parameters:**
- `latitude` - Широта
- `longitude` - Долгота
- `radiusMeters` (default: 1000) - Радиус в метрах
- `limit` (default: 20) - Лимит результатов

### Настройки приватности

#### GET `/api/geo/privacy/{userId}`
Получить настройки гео-приватности

**Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "visibility": "APPROXIMATE",
  "sharingRule": "ALL",
  "showOnlyWhenOnline": false,
  "hideWhenInactive": true,
  "inactivityMinutes": 30
}
```

#### PUT `/api/geo/privacy/{userId}`
Обновить настройки приватности

**Request Body:**
```json
{
  "visibility": "CITY_ONLY",
  "sharingRule": "FRIENDS",
  "showOnlyWhenOnline": true,
  "hideWhenInactive": true,
  "inactivityMinutes": 60
}
```

#### GET `/api/geo/privacy/{userId}/location?requesterId={requesterId}`
Получить локацию с учетом приватности

**Query Parameters:**
- `requesterId` - ID запрашивающего пользователя

**Response:** 200 OK или 404 (если скрыта)

### Гео-зоны

#### GET `/api/geo/zones/{userId}`
Получить гео-зоны пользователя

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Дом",
    "type": "HOME",
    "centerLatitude": 55.7558,
    "centerLongitude": 37.6173,
    "radiusMeters": 500,
    "visibilityInZone": "EXACT",
    "createdAt": "2025-10-31T20:00:00"
  }
]
```

#### POST `/api/geo/zones/{userId}`
Создать гео-зону

**Request Body:**
```json
{
  "name": "Работа",
  "type": "WORK",
  "centerLatitude": 55.7500,
  "centerLongitude": 37.6000,
  "radiusMeters": 1000,
  "visibilityInZone": "EXACT"
}
```

#### DELETE `/api/geo/zones/{zoneId}?userId={userId}`
Удалить гео-зону

## 📊 Уровни точности

| Уровень | Диапазон | Использование |
|---------|----------|---------------|
| `HIGH` | ≤ 50м | Точные встречи и доставка |
| `MEDIUM` | ≤ 500м | Поиск в районе |
| `LOW` | ≤ 5км | Городской поиск |
| `CITY` | ≤ 50км | Региональный поиск |

## 📊 Уровни видимости

| Уровень | Описание |
|---------|----------|
| `EXACT` | Точные координаты с высокой точностью |
| `APPROXIMATE` | Район/квартал (500м радиус) |
| `CITY_ONLY` | Только город/район города |
| `HIDDEN` | Локация полностью скрыта |

## 🔗 Интеграции

- **Task модуль:** Геопоиск задач поблизости
- **Profile модуль:** Настройки видимости местоположения
- **Redis:** Кэширование результатов поиска

## 💡 Примеры использования

### Поиск пользователей в радиусе 2 км
```http
GET /api/geo/search/nearby-users?latitude=55.7558&longitude=37.6173&radiusMeters=2000&limit=10
```

### Создание гео-зоны для дома
```json
POST /api/geo/zones/1
{
  "name": "Дом",
  "type": "HOME",
  "centerLatitude": 55.7558,
  "centerLongitude": 37.6173,
  "radiusMeters": 500,
  "visibilityInZone": "EXACT"
}
```

## 🔒 Безопасность и приватность

- Автоматическое округление координат согласно настройкам приватности
- Скрытие локации при бездействии
- Фильтрация по правилам sharing (всем/друзьям/никому)
- Автоматическое определение зон с соответствующими правилами

