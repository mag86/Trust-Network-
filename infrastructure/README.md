# 🏗️ Infrastructure модуль

Модуль содержит mock-реализации сервисов для разработки и тестирования без зависимостей от реальных микросервисов.

## 📋 Назначение

Infrastructure модуль предоставляет:
- Mock-реализации интерфейсов из core модуля
- Заглушки для внешних интеграций
- Утилиты для разработки и тестирования

## 🔌 Mock реализации

### CreditServiceMockImpl
Mock-реализация CreditService для разработки

**Особенности:**
- In-memory хранение балансов пользователей
- Начальный баланс: 100 кредитов
- Базовая валидация достаточности средств

**Использование:**
```java
@Qualifier("mockCreditService")
public class CreditServiceMockImpl implements CreditService {
    // In-memory реализация
}
```

### EscrowServiceMockImpl
Mock-реализация EscrowService

**Особенности:**
- In-memory хранение escrow транзакций
- Интеграция с CreditServiceMockImpl
- Автоматический возврат/перевод средств

## 🔄 Замена на реальные реализации

Для перехода на реальные микросервисы или REST API:

1. Создать реальные реализации интерфейсов из core
2. Заменить `@Qualifier("mockCreditService")` на реальный bean
3. Обновить зависимости в модулях

## 📦 Зависимости

- Core модуль (интерфейсы)
- Spring Boot (для dependency injection)

## 💡 Рекомендации

- Использовать mock-реализации для разработки и unit-тестов
- Для integration-тестов и production использовать реальные реализации через REST или message queues

