# 🔐 Модуль Аутентификации (Auth)

Модуль предоставляет полную систему аутентификации, регистрации, управления сессиями и безопасностью пользователей.

## 📋 Функциональные возможности

### FR1.1: Регистрация пользователя
- Регистрация по email/паролю с валидацией
- Верификация email через токен (24 часа)
- Автоматическая настройка начального профиля
- Начальный баланс: 100 кредитов

### FR1.2: Аутентификация и вход
- Вход по email/паролю
- JWT токены (access token - 1 час, refresh token - 7 дней)
- Управление активными сессиями
- Ограничение попыток входа: 5 попыток за 15 минут

### FR1.3: Восстановление доступа
- Восстановление пароля через email
- Временная ссылка (1 час)
- Автоматический выход со всех устройств
- Ограничение: 3 попытки в час

### FR1.4: Управление аккаунтом
- Автоблокировка после 10 неудачных попыток (30 минут)
- Управление сессиями (просмотр, завершение)
- История паролей (запрет повторного использования)

## 🚀 API Endpoints

### Регистрация и верификация

#### POST `/api/auth/register`
Регистрация нового пользователя

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "displayName": "John Doe"
}
```

**Response:** 200 OK
```json
{
  "id": 1,
  "email": "user@example.com",
  "status": "PENDING_VERIFICATION",
  "createdAt": "2025-10-31T20:00:00"
}
```

#### POST `/api/auth/verify-email?token={token}`
Подтверждение email адреса

**Response:** 200 OK - "Email успешно подтвержден"

#### POST `/api/auth/resend-verification?email={email}`
Повторная отправка письма верификации

### Аутентификация

#### POST `/api/auth/login`
Вход в систему

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "user@example.com"
}
```

#### POST `/api/auth/refresh?refreshToken={token}`
Обновление access token

**Response:** 200 OK (новые токены)

#### POST `/api/auth/logout?refreshToken={token}`
Выход из системы и завершение сессии

### Восстановление пароля

#### POST `/api/auth/password-reset`
Запрос на восстановление пароля

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/password-reset/confirm`
Подтверждение сброса пароля

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123"
}
```

### Управление сессиями

#### GET `/api/auth/sessions/{userId}`
Получить список активных сессий

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "createdAt": "2025-10-31T20:00:00",
    "lastUsedAt": "2025-10-31T22:00:00",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "isActive": true
  }
]
```

#### DELETE `/api/auth/sessions/{sessionId}?userId={userId}`
Завершить конкретную сессию

#### DELETE `/api/auth/sessions/all/{userId}`
Завершить все активные сессии

## 🔒 Безопасность

- **Хеширование паролей:** BCrypt
- **JWT токены:** HMAC SHA-256
- **Защита от brute-force:** Ограничение попыток входа
- **Автоблокировка:** После 10 неудачных попыток
- **Валидация паролей:** Минимум 8 символов, 1 заглавная, 1 цифра

## 📦 Зависимости

- Spring Boot Security
- JWT (io.jsonwebtoken)
- Spring Data JPA
- Jakarta Validation

## 🔗 Интеграции

- **Credit модуль:** Начальный баланс при регистрации
- **Profile модуль:** Создание базового профиля
- **Reputation модуль:** Начальный Trust Score

