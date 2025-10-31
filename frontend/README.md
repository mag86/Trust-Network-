# 🎨 Frontend - Trust Network

React 18 + TypeScript приложение с Material-UI, Redux Toolkit и Leaflet для карт.

## 📦 Технологический стек

### Основные библиотеки
- **React 19.2** - UI библиотека
- **TypeScript 4.9** - Типизация
- **Material-UI 5.15** - Компоненты UI и дизайн-система
- **Redux Toolkit 2.0** - State management
- **React Router 6.21** - Маршрутизация
- **Axios 1.6** - HTTP клиент
- **Leaflet 1.9** - Карты
- **React Leaflet 4.2** - React обертка для Leaflet
- **date-fns 2.30** - Работа с датами

## 📁 Структура проекта

```
frontend/
├── public/                          # Статические файлы
│   ├── index.html                  # HTML шаблон
│   ├── robots.txt                  # SEO robots
│   └── ...
│
├── src/
│   ├── components/                 # Переиспользуемые компоненты
│   │   ├── common/                 # Общие компоненты
│   │   │   ├── Layout.tsx         # Основной layout с навигацией
│   │   │   ├── SearchBar.tsx      # Поисковая строка
│   │   │   ├── NotificationCenter.tsx  # Центр уведомлений
│   │   │   └── FloatingActionButton.tsx # FAB для быстрых действий
│   │   │
│   │   ├── auth/                   # Компоненты аутентификации
│   │   │   └── (компоненты форм будут добавлены при необходимости)
│   │   │
│   │   ├── profile/                # Компоненты профиля
│   │   │   ├── ProfileHeader.tsx   # Шапка профиля (аватар, имя, Trust Score)
│   │   │   ├── SkillCard.tsx       # Карточка навыка с рейтингом
│   │   │   └── SkillForm.tsx      # Форма добавления навыка
│   │   │
│   │   ├── task/                   # Компоненты задач
│   │   │   ├── TaskCard.tsx        # Карточка задачи в ленте
│   │   │   ├── TaskForm.tsx        # Форма создания задачи
│   │   │   ├── BidForm.tsx         # Форма подачи заявки
│   │   │   └── BidCard.tsx         # Карточка заявки на задачу
│   │   │
│   │   ├── credit/                 # Компоненты кредитов
│   │   │   ├── BalanceCard.tsx     # Карточка баланса и статистики
│   │   │   ├── TransferForm.tsx    # Форма P2P перевода
│   │   │   └── TransactionList.tsx # Список транзакций с деталями
│   │   │
│   │   ├── geolocation/            # Компоненты геолокации
│   │   │   ├── MapView.tsx         # Интерактивная карта Leaflet
│   │   │   └── PrivacySettingsForm.tsx # Настройки гео-приватности
│   │   │
│   │   └── reputation/             # Компоненты репутации
│   │       ├── TrustScorePanel.tsx # Панель Trust Score с визуализацией
│   │       ├── ReviewForm.tsx      # Форма оставления отзыва
│   │       ├── ReviewCard.tsx      # Карточка отзыва
│   │       └── BadgeCard.tsx        # Карточка бейджа
│   │
│   ├── pages/                      # Страницы приложения
│   │   ├── Auth/                   # Страницы аутентификации
│   │   │   ├── LoginPage.tsx       # Страница входа
│   │   │   ├── RegisterPage.tsx    # Страница регистрации
│   │   │   ├── ForgotPasswordPage.tsx # Восстановление пароля
│   │   │   └── ResetPasswordPage.tsx  # Установка нового пароля
│   │   │
│   │   ├── Dashboard/              # Главная страница
│   │   │   └── DashboardPage.tsx   # Дашборд пользователя
│   │   │
│   │   ├── Profile/                # Страницы профиля
│   │   │   ├── ProfileViewPage.tsx # Просмотр профиля
│   │   │   └── ProfileEditPage.tsx # Редактирование профиля
│   │   │
│   │   ├── Credit/                 # Страницы кредитов
│   │   │   └── CreditDashboardPage.tsx # Дашборд кредитов
│   │   │
│   │   ├── Task/                   # Страницы задач
│   │   │   └── TaskListPage.tsx    # Лента задач
│   │   │
│   │   ├── Geolocation/            # Страницы геолокации
│   │   │   └── GeolocationPage.tsx # Карта и настройки локации
│   │   │
│   │   └── Reputation/             # Страницы репутации
│   │       └── ReputationPage.tsx  # Trust Score и отзывы
│   │
│   ├── store/                      # Redux store
│   │   ├── store.ts                # Главный store
│   │   │
│   │   ├── auth/                   # Auth slice
│   │   │   └── authSlice.ts        # Состояние аутентификации
│   │   │
│   │   ├── profile/                # Profile slice
│   │   │   └── profileSlice.ts      # Состояние профиля и навыков
│   │   │
│   │   ├── credit/                 # Credit slice
│   │   │   └── creditSlice.ts      # Состояние баланса и транзакций
│   │   │
│   │   ├── task/                   # Task slice
│   │   │   └── taskSlice.ts        # Состояние задач и заявок
│   │   │
│   │   ├── geolocation/            # Geolocation slice
│   │   │   └── geolocationSlice.ts # Состояние локации и настроек
│   │   │
│   │   ├── reputation/             # Reputation slice
│   │   │   └── reputationSlice.ts  # Состояние Trust Score и отзывов
│   │   │
│   │   └── notification/           # Notification slice
│   │       └── notificationSlice.ts # Состояние уведомлений
│   │
│   ├── services/                   # API сервисы
│   │   └── api.ts                  # Axios клиент с interceptors
│   │
│   ├── types/                      # TypeScript типы
│   │   ├── index.ts                # Общие типы (User, ApiError)
│   │   ├── profile.ts              # Типы профиля
│   │   ├── credit.ts               # Типы кредитов
│   │   ├── task.ts                 # Типы задач
│   │   ├── geolocation.ts          # Типы геолокации
│   │   ├── reputation.ts           # Типы репутации
│   │   └── notification.ts         # Типы уведомлений
│   │
│   ├── utils/                      # Утилиты
│   │   └── (будут добавлены при необходимости)
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── (будут добавлены при необходимости)
│   │
│   ├── styles/                     # Глобальные стили
│   │   └── (будут добавлены при необходимости)
│   │
│   ├── App.tsx                     # Главный компонент приложения
│   ├── index.tsx                   # Точка входа
│   └── ...
│
└── package.json                    # Зависимости проекта
```

## 🏗️ Архитектура

### State Management (Redux Toolkit)

Проект использует Redux Toolkit для управления состоянием. Каждый модуль имеет свой slice:

```typescript
// Пример структуры slice
interface ModuleState {
  data: DataType[];
  selected: DataType | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterType;
  pagination: PaginationType;
}
```

**Основные паттерны:**
- **Async Thunks** - для асинхронных операций (API запросы)
- **Slices** - для синхронных обновлений состояния
- **Selectors** - для доступа к состоянию в компонентах

### API Integration

Все API запросы идут через централизованный Axios клиент (`services/api.ts`):

```typescript
// Автоматическое добавление JWT токена
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Автоматическое обновление токенов
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Попытка обновить токен через refresh token
    }
  }
);
```

### Роутинг

React Router 6 используется для навигации:

```typescript
// Защищенные маршруты через PrivateRoute HOC
<Route
  path="/profile/:userId"
  element={
    <PrivateRoute>
      <ProfileViewPage />
    </PrivateRoute>
  }
/>
```

## 📋 Реализованные модули

### ✅ UI-FR1: Модуль аутентификации

**Компоненты:**
- `LoginPage` - Страница входа с валидацией
- `RegisterPage` - Регистрация с индикатором надежности пароля
- `ForgotPasswordPage` - Запрос восстановления с таймером
- `ResetPasswordPage` - Установка нового пароля

**Функции:**
- JWT токены (access/refresh)
- Валидация email и пароля
- Восстановление пароля через email
- Автоматический выход со всех устройств

**Redux:**
- `authSlice` - состояние пользователя, токенов, загрузки

### ✅ UI-FR2: Модуль геолокации

**Компоненты:**
- `MapView` - Интерактивная карта на Leaflet
- `PrivacySettingsForm` - Настройки приватности локации

**Функции:**
- Отображение пользователей и задач на карте
- Обновление местоположения через Geolocation API
- Настройки видимости (Точная/Приблизительная/Скрытая)
- Автоматическое скрытие при бездействии

**Redux:**
- `geolocationSlice` - текущая локация, nearby пользователи, настройки приватности

### ✅ UI-FR3: Модуль профиля

**Компоненты:**
- `ProfileHeader` - Шапка с аватаром, именем, Trust Score
- `SkillCard` - Карточка навыка с 5-звездочным рейтингом
- `SkillForm` - Форма добавления навыка

**Страницы:**
- `ProfileViewPage` - Просмотр с вкладками (О себе, Навыки, Отзывы, Активность)
- `ProfileEditPage` - Редактирование профиля и навыков

**Функции:**
- Создание и редактирование профиля
- Управление навыками (добавление, удаление)
- Теги и категории
- История изменений

**Redux:**
- `profileSlice` - профиль, навыки, теги, настройки приватности

### ✅ UI-FR4: Модуль кредитов

**Компоненты:**
- `BalanceCard` - Карточка баланса с статистикой
- `TransferForm` - Форма P2P перевода с расчетом комиссии
- `TransactionList` - Список транзакций с раскрывающимися деталями

**Страницы:**
- `CreditDashboardPage` - Дашборд с балансом, статистикой и историей

**Функции:**
- Отображение доступного и зарезервированного баланса
- P2P переводы с комиссией 5%
- Фильтрация и поиск транзакций
- Статистика (получено/потрачено, комиссии, бонусы)

**Redux:**
- `creditSlice` - баланс, транзакции, фильтры, пагинация

### ✅ UI-FR5: Модуль задач

**Компоненты:**
- `TaskCard` - Карточка задачи в ленте
- `TaskForm` - Форма создания задачи
- `BidForm` - Форма подачи заявки
- `BidCard` - Карточка заявки

**Страницы:**
- `TaskListPage` - Лента задач с фильтрами и поиском

**Функции:**
- Создание задач с резервированием кредитов
- Поиск и фильтрация (категория, цена, радиус)
- Подача заявок на выполнение
- Управление заявками (принять/отклонить)

**Redux:**
- `taskSlice` - задачи, заявки, фильтры, пагинация

### ✅ UI-FR6: Модуль репутации

**Компоненты:**
- `TrustScorePanel` - Панель Trust Score с progress bar
- `ReviewForm` - Форма отзыва с детальными оценками
- `ReviewCard` - Карточка отзыва
- `BadgeCard` - Карточка бейджа

**Страницы:**
- `ReputationPage` - Страница репутации с вкладками

**Функции:**
- Визуализация Trust Score (0-100) с уровнями
- 5-звездочный рейтинг с полузвездами
- Детальные оценки (качество, сроки, коммуникация, цена/качество)
- Публичные и приватные комментарии
- Бейджи и достижения

**Redux:**
- `reputationSlice` - Trust Score, отзывы, бейджи

### ✅ UI-NOTIF: Система уведомлений

**Компоненты:**
- `NotificationCenter` - Центр уведомлений (Menu + Drawer)

**Функции:**
- Бейдж с количеством непрочитанных
- Группировка по типам
- Отметка прочитанных
- Удаление уведомлений
- Переход по actionUrl

**Redux:**
- `notificationSlice` - уведомления, счетчик непрочитанных

### ✅ UI-NAV: Навигация

**Компоненты:**
- `Layout` - Основной layout с AppBar и Footer
- `SearchBar` - Поисковая строка
- `FloatingActionButton` - FAB для быстрых действий

**Функции:**
- Поиск по платформе
- Быстрые ссылки на модули
- Центр уведомлений
- Footer с ссылками

## 🎨 Дизайн-система

### Цветовая палитра

```typescript
primary: '#6366F1'    // Индиго - основной цвет
secondary: '#10B981'  // Зеленый - акцентный
background: '#F9FAFB' // Светло-серый фон
```

### Уровни репутации (цвета)

- **Новичок (0-29):** `#EF4444` 🔴
- **Опытный (30-59):** `#F59E0B` 🟨
- **Эксперт (60-84):** `#3B82F6` 🟦
- **Мастер (85-100):** `#10B981` 🟩

### Типографика

- **Основной шрифт:** Inter
- **Моноширинный:** JetBrains Mono (для кода)
- **Иерархия:** h1-h6 с соответствующими размерами

### Компоненты Material-UI

Все компоненты используют Material-UI темы и адаптивность:
- **Кнопки:** primary, secondary, danger, ghost
- **Карточки:** для контента с тенями и закруглениями
- **Модальные окна:** Dialog для форм и подтверждений
- **Формы:** TextField, Select, Checkbox с валидацией

## 🚀 Запуск проекта

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm start
```

Приложение откроется на http://localhost:3000

### Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `build/`

### Запуск тестов

```bash
npm test
```

## ⚙️ Конфигурация

### Переменные окружения

Создайте файл `.env` в корне `frontend/`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

### API Integration

Все API запросы идут через `src/services/api.ts`:
- Базовый URL из переменной окружения
- Автоматическое добавление JWT токена
- Обновление токенов при истечении
- Обработка ошибок (401 → redirect to login)

## 📱 Адаптивность

Проект полностью адаптивен для всех устройств:

- **Десктоп (1280px+):** Полная функциональность, поиск в навигации
- **Планшеты (768px-1279px):** Адаптированная сетка, упрощенная навигация
- **Мобильные (320px-767px):** Вертикальная компоновка, скрытый поиск

## ♿ Доступность (a11y)

- Поддержка скринридеров (ARIA labels)
- Навигация с клавиатуры (Tab, Enter, Esc)
- Соответствие WCAG 2.1 Level AA
- Высококонтрастные темы через Material-UI

## 🔐 Безопасность

- **JWT токены** хранятся в localStorage
- **Автоматическое обновление** токенов через interceptors
- **Валидация** всех форм на клиенте и сервере
- **HTTPS** обязателен для production
- **XSS защита** через React автоматическую санитизацию

## 📈 Производительность

- **Ленивая загрузка** компонентов (React.lazy - готов к добавлению)
- **Кэширование** через Redux для API запросов
- **Оптимизация изображений** (placeholder, lazy loading)
- **Code splitting** (готов к добавлению)

## 🔗 Маршруты

### Публичные
- `/login` - Вход
- `/register` - Регистрация
- `/forgot-password` - Восстановление пароля
- `/reset-password?token=...` - Установка нового пароля

### Защищенные (требуют аутентификации)
- `/dashboard` - Главная страница
- `/profile/:userId` - Просмотр профиля
- `/profile/:userId/edit` - Редактирование профиля
- `/credits` - Дашборд кредитов
- `/tasks` - Лента задач
- `/geolocation` - Карта и геолокация
- `/reputation/:userId` - Страница репутации

## 📊 Redux Store Structure

```typescript
{
  auth: {
    user: User | null;
    tokens: Tokens | null;
    isLoading: boolean;
    error: string | null;
  };
  profile: {
    profile: UserProfile | null;
    skills: Skill[];
    tags: Tag[];
    privacySettings: PrivacySettings | null;
    isLoading: boolean;
    error: string | null;
  };
  credit: {
    balance: CreditBalance | null;
    transactions: Transaction[];
    filters: FilterType;
    pagination: PaginationType;
    isLoading: boolean;
    error: string | null;
  };
  task: {
    tasks: Task[];
    selectedTask: Task | null;
    bids: Bid[];
    filters: FilterType;
    pagination: PaginationType;
    isLoading: boolean;
    error: string | null;
  };
  geolocation: {
    currentLocation: UserLocation | null;
    nearbyUsers: NearbyUser[];
    privacySettings: GeoPrivacySettings | null;
    zones: GeoZone[];
    isLoading: boolean;
    error: string | null;
  };
  reputation: {
    trustScore: TrustScore | null;
    reviews: Review[];
    badges: Badge[];
    filters: FilterType;
    pagination: PaginationType;
    isLoading: boolean;
    error: string | null;
  };
  notification: {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
  };
}
```

## 🧪 Тестирование

Используется React Testing Library для unit и integration тестов:

```bash
npm test
```

Тесты находятся в папках `**/__tests__/` рядом с компонентами.

## 📝 Примеры использования

### Создание задачи

```typescript
import { useDispatch } from 'react-redux';
import { createTask } from '../../store/task/taskSlice';

const TaskComponent = () => {
  const dispatch = useDispatch();
  
  const handleCreate = async (taskData: TaskCreateRequest) => {
    try {
      await dispatch(createTask({ userId: 1, task: taskData })).unwrap();
      // Задача создана успешно
    } catch (error) {
      // Обработка ошибки
    }
  };
};
```

### Работа с уведомлениями

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead } from '../../store/notification/notificationSlice';

const NotificationComponent = () => {
  const { notifications, unreadCount } = useSelector(state => state.notification);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchNotifications(userId));
  }, []);
};
```

### Интеграция с геолокацией

```typescript
import { MapView } from '../../components/geolocation/MapView';

<MapView
  currentLocation={userLocation}
  nearbyUsers={nearbyUsers}
  tasks={tasksWithLocation}
  onLocationClick={(userId) => navigate(`/profile/${userId}`)}
  onTaskClick={(taskId) => navigate(`/tasks/${taskId}`)}
/>
```

## 🔄 Паттерны разработки

### Компоненты
- **Функциональные компоненты** с hooks
- **Типизация** через TypeScript interfaces
- **Props destructuring** для читаемости
- **Conditional rendering** для состояний

### State Management
- **Async Thunks** для всех API запросов
- **Local state** только для UI состояния
- **Redux** для глобального состояния
- **Selectors** для доступа к данным

### Формы
- **Контролируемые компоненты** (controlled components)
- **Валидация в реальном времени**
- **Отображение ошибок** под полями
- **Блокировка при отправке**

## 🐛 Известные проблемы и TODO

### TODO
- [ ] Добавить WebSocket для real-time уведомлений
- [ ] Реализовать ленивую загрузку компонентов (React.lazy)
- [ ] Добавить PWA поддержку
- [ ] Международная локализация (i18n)
- [ ] Unit и integration тесты для всех компонентов
- [ ] Оптимизация bundle size
- [ ] Добавить Error Boundary компоненты

### Известные ограничения
- Leaflet иконки требуют ручной настройки в React
- Некоторые API endpoints еще не реализованы на backend (используются моки)

## 📚 Дополнительные ресурсы

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Leaflet Documentation](https://leafletjs.com/)

## 👥 Команда

Trust Network Frontend Development Team

---

**Версия:** 0.1.0  
**Последнее обновление:** Октябрь 2025
