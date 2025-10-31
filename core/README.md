# 🎯 Core модуль

Базовый модуль с общими интерфейсами, API контрактами и конфигурацией для всех модулей системы.

## 📋 Назначение

Core модуль содержит:
- Общие интерфейсы для интеграции между модулями
- Конфигурацию OpenAPI/Swagger
- Базовые абстракции и утилиты

## 🔌 Интерфейсы API

### CreditService
Интерфейс для работы с кредитами пользователей

```java
public interface CreditService {
    int getUserBalance(Long userId);
    void reserveCredits(Long userId, int amount);
}
```

**Реализации:**
- `CreditServiceAdapter` (credit модуль) - реальная реализация
- `CreditServiceMockImpl` (infrastructure модуль) - mock для разработки

### EscrowService
Интерфейс для управления escrow-транзакциями

```java
public interface EscrowService {
    void reserve(Long taskId, Long userId, int amount);
    void releaseToExecutor(Long taskId, Long executorId);
    void refundToCreator(Long taskId, Long creatorId);
}
```

**Реализации:**
- `EscrowServiceMockImpl` (infrastructure модуль) - mock реализация

## ⚙️ Конфигурация

### OpenApiConfig
Глобальная конфигурация Swagger/OpenAPI для всех модулей

- **URL:** `/swagger-ui.html`
- **API Docs:** `/api-docs`
- **Версия:** v0.0.1

## 🔗 Использование в других модулях

Все модули (auth, task, credit, reputation, profile, geolocation) зависят от core модуля для:
- Использования общих интерфейсов API
- Доступа к конфигурации Swagger
- Единообразной интеграции между модулями

## 📦 Зависимости

Core модуль не имеет внешних зависимостей, кроме Spring Boot для конфигурации.

