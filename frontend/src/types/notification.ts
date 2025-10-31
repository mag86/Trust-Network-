// Типы для системы уведомлений

export type NotificationType =
  | 'NEW_BID'
  | 'TASK_STATUS_CHANGED'
  | 'INCOMING_TRANSFER'
  | 'NEW_REVIEW'
  | 'SYSTEM'
  | 'BONUS_AWARDED'
  | 'BADGE_EARNED'
  | 'TASK_NEARBY';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number; // ID связанного объекта (задача, транзакция и т.д.)
  actionUrl?: string; // URL для перехода при клике
}

export interface NotificationCount {
  unread: number;
  total: number;
}

