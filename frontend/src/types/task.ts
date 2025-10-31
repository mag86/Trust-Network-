// Типы для модуля задач

export type TaskCategory = 'WORK' | 'STUDY' | 'VOLUNTEER' | 'DELIVERY' | 'SERVICES' | 'OTHER';

export type TaskStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface Task {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  creditReward: number;
  status: TaskStatus;
  creatorId: number;
  executorId?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
  };
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  category: TaskCategory;
  creditReward: number;
  deadline?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface TaskSearchRequest {
  lat?: number;
  lon?: number;
  radiuskm?: number;
  category?: TaskCategory;
  minCredit?: number;
  maxCredit?: number;
  status?: TaskStatus;
  deadlineBefore?: string;
  page?: number;
  size?: number;
}

export interface Bid {
  id: number;
  taskId: number;
  userId: number;
  message: string;
  proposedDeadline?: string;
  portfolioUrl?: string;
  status: 'ACTIVE' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface BidCreateRequest {
  message: string;
  proposedDeadline?: string;
  portfolioUrl?: string;
}

