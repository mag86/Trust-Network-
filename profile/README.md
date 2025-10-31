# 👤 Модуль Профилей (Profile)

Модуль предоставляет систему для создания, управления и отображения профилей пользователей с навыками, тегами и настройками приватности.

## 📋 Функциональные возможности

### FR3.1: Создание и редактирование профиля
- Базовая информация (отображаемое имя, аватар, биография)
- Контактная информация (email, телеграм)
- Валидация уникальности отображаемого имени
- История изменений профиля (последние 30 дней)
- Статистика просмотров профиля

### FR3.2: Система навыков и компетенций
- Категории: Технические, Творческие, Бытовые, Образовательные, Бизнес
- Уровни владения: 1 (Новичок) - 5 (Мастер)
- Типы верификации: Самопроверка, Тестирование, Верификация через задачи, Рекомендации

### FR3.3: Система тегов и категорий
- Пользовательские теги
- Автоматические теги на основе активности
- Популярные теги в сообществе
- Автодополнение и рекомендации

### FR3.4: Настройки приватности
- Уровни: Публичный, Только участникам, Ограниченный, Приватный
- Гранулярный контроль видимости (контакты, статистика, отзывы, местоположение)
- Блокировка пользователей
- Гео-приватность (интеграция с geolocation модулем)

## 🚀 API Endpoints

### Управление профилем

#### GET `/api/profiles/{userId}`
Получить профиль пользователя

**Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Профессиональный программист с опытом 5 лет",
  "email": "john@example.com",
  "telegram": "@johndoe",
  "privacyLevel": "PUBLIC",
  "viewCount": 150,
  "createdAt": "2025-10-31T20:00:00"
}
```

#### PUT `/api/profiles/{userId}`
Обновить профиль

**Request Body:**
```json
{
  "displayName": "John Doe Updated",
  "bio": "Обновленная биография",
  "email": "newemail@example.com",
  "telegram": "@newtelegram",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "privacyLevel": "LIMITED"
}
```

**Ошибки:**
- `400` - Отображаемое имя уже занято

### Управление навыками

#### GET `/api/profiles/{userId}/skills`
Получить навыки пользователя

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Java Programming",
    "category": "TECHNICAL",
    "level": 4,
    "verificationType": "TASK_VERIFIED",
    "addedAt": "2025-10-31T20:00:00"
  }
]
```

#### POST `/api/profiles/{userId}/skills`
Добавить навык

**Request Body:**
```json
{
  "name": "Python Development",
  "category": "TECHNICAL",
  "level": 3,
  "verificationType": "SELF_ASSESSED"
}
```

#### DELETE `/api/profiles/{userId}/skills/{skillId}`
Удалить навык

### Управление тегами

#### GET `/api/profiles/{userId}/tags`
Получить теги пользователя

#### POST `/api/profiles/{userId}/tags`
Добавить тег

**Request Body:**
```json
{
  "name": "веб-разработка"
}
```

#### DELETE `/api/profiles/{userId}/tags/{tagId}`
Удалить тег

#### GET `/api/profiles/{userId}/tags/popular`
Получить популярные теги в сообществе

### Настройки приватности

#### GET `/api/profiles/{userId}/privacy`
Получить настройки приватности

**Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "contactsVisibility": "EXECUTORS_ONLY",
  "taskStatsVisibility": "ALL",
  "reviewsVisibility": "ALL",
  "locationVisibility": "CITY_ONLY"
}
```

#### PUT `/api/profiles/{userId}/privacy`
Обновить настройки приватности

**Request Body:**
```json
{
  "contactsVisibility": "NONE",
  "taskStatsVisibility": "ALL",
  "reviewsVisibility": "EXECUTORS_ONLY",
  "locationVisibility": "APPROXIMATE"
}
```

### Блокировка пользователей

#### POST `/api/profiles/{userId}/blocks/{blockedId}`
Заблокировать пользователя

#### DELETE `/api/profiles/{userId}/blocks/{blockedId}`
Разблокировать пользователя

#### GET `/api/profiles/{userId}/blocks`
Получить список заблокированных пользователей

## 📊 Уровни приватности

| Уровень | Описание |
|---------|----------|
| `PUBLIC` | Вся информация доступна всем |
| `REGISTERED_ONLY` | Только зарегистрированным пользователям |
| `LIMITED` | Базовая информация + навыки |
| `PRIVATE` | Только имя и аватар |

## 📊 Категории навыков

| Категория | Примеры |
|-----------|---------|
| `TECHNICAL` | Программирование, Дизайн, Аналитика |
| `CREATIVE` | Копирайтинг, Фотография, Видеомонтаж |
| `HOUSEHOLD` | Ремонт, Уборка, Доставка |
| `EDUCATIONAL` | Репетиторство, Консультации |
| `BUSINESS` | Маркетинг, Управление, Консалтинг |

## 📊 Уровни навыков

| Уровень | Описание |
|---------|----------|
| 1 | Новичок - базовые знания |
| 2 | Опытный - уверенное владение |
| 3 | Продвинутый - профессиональный уровень |
| 4 | Эксперт - углубленные знания |
| 5 | Мастер - признанный специалист |

## 🔗 Интеграции

- **Auth модуль:** Создание профиля при регистрации
- **Reputation модуль:** Отображение Trust Score в профиле
- **Geolocation модуль:** Настройки видимости местоположения
- **Task модуль:** Поиск исполнителей по навыкам

