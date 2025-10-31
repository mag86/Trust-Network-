# 🌐 Trust Network - Монорепозиторий

Платформа для доверительных взаимоотношений и выполнения задач с системой репутации и кредитов доверия.

## 📁 Структура проекта

Проект организован как multi-module Maven проект:

```
Trust/
├── core/              # Базовый модуль с интерфейсами и конфигурацией
├── auth/              # Модуль аутентификации и регистрации
├── credit/            # Модуль кредитов доверия и транзакций
├── task/              # Модуль задач и услуг
├── reputation/        # Модуль репутации и отзывов
├── profile/           # Модуль профилей пользователей
├── geolocation/       # Модуль геолокации и поиска
├── infrastructure/    # Mock-реализации для разработки
└── frontend/          # React + TypeScript frontend
```

## 🚀 Быстрый старт

### Требования
- Java 17+
- Maven 3.6+
- PostgreSQL 14+
- Redis (для кэширования)
- Node.js 18+ (для frontend)

### Запуск backend

```bash
# Сборка всех модулей
mvn clean install

# Запуск (требуется создание главного приложения в одном из модулей)
mvn spring-boot:run
```

### Запуск frontend

```bash
cd frontend
npm install
npm start
```

## 📚 Документация API

После запуска приложения Swagger UI доступен по адресу:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Docs (JSON):** http://localhost:8080/api-docs

## 🏗️ Архитектура модулей

### 🔐 Auth - Аутентификация
- Регистрация и верификация email
- JWT токены (access/refresh)
- Восстановление пароля
- Управление сессиями
- [Подробнее →](auth/README.md)

### 💰 Credit - Кредиты доверия
- Система баланса с лимитами
- P2P переводы с комиссией
- Escrow для задач
- История транзакций
- Бонусные начисления
- [Подробнее →](credit/README.md)

### 📝 Task - Задачи и услуги
- Создание и поиск задач
- Подача заявок на выполнение
- Система подтверждения выполнения
- Escrow-система для безопасности
- Автоматическое управление статусами
- [Подробнее →](task/README.md)

### ⭐ Reputation - Репутация
- Система оценок и отзывов (5-звездочная)
- Расчет Trust Score
- Визуализация репутации
- Бейджи и достижения
- [Подробнее →](reputation/README.md)

### 👤 Profile - Профили
- Создание и редактирование профиля
- Система навыков и компетенций
- Теги и категории
- Настройки приватности
- Блокировка пользователей
- [Подробнее →](profile/README.md)

### 🗺️ Geolocation - Геолокация
- Определение местоположения
- Поиск объектов в радиусе
- Настройки приватности геолокации
- Гео-зоны (дом/работа/публичные места)
- Кэширование через Redis
- [Подробнее →](geolocation/README.md)

## 🔗 Интеграции между модулями

```
Auth → Credit: Начальный баланс при регистрации
Auth → Profile: Создание базового профиля
Task → Credit: Escrow для резервирования кредитов
Task → Geolocation: Геопоиск задач
Task → Reputation: Отзывы после завершения
Reputation → Profile: Отображение Trust Score
Profile → Geolocation: Настройки видимости локации
```

## 🧪 Тестирование

### Unit тесты
```bash
mvn test
```

### Запуск тестов конкретного модуля
```bash
cd auth
mvn test
```

## 📦 Зависимости

### Backend
- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- Redis
- JWT (io.jsonwebtoken)
- Swagger/OpenAPI (springdoc-openapi)

### Frontend
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- Leaflet (карты)
- Axios

## 🔒 Безопасность

- JWT токены для аутентификации
- BCrypt для хеширования паролей
- Rate limiting на endpoints аутентификации
- Защита от brute-force атак
- Валидация всех входных данных
- HTTPS обязателен для production

## 🐳 Docker

Docker конфигурация будет добавлена для:
- PostgreSQL 14
- Redis
- Backend приложения
- Frontend приложения

## 📄 Лицензия

MIT License

## 👥 Команда

Trust Network Development Team

---

**Документация по модулям:**
- [Auth Module](auth/README.md)
- [Credit Module](credit/README.md)
- [Task Module](task/README.md)
- [Reputation Module](reputation/README.md)
- [Profile Module](profile/README.md)
- [Geolocation Module](geolocation/README.md)
- [Core Module](core/README.md)
- [Infrastructure Module](infrastructure/README.md)

