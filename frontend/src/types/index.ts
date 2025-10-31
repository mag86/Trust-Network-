// Общие типы для всего приложения

export interface User {
  id: number;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'BLOCKED';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

