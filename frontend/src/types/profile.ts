// Типы для модуля профиля

export interface UserProfile {
  id: number;
  userId: number;
  displayName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  email?: string;
  telegram?: string;
  privacyLevel: 'PUBLIC' | 'REGISTERED_ONLY' | 'LIMITED' | 'PRIVATE';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  userId: number;
  name: string;
  category: 'TECHNICAL' | 'CREATIVE' | 'HOUSEHOLD' | 'EDUCATIONAL' | 'BUSINESS';
  level: 1 | 2 | 3 | 4 | 5;
  verificationType: 'SELF_ASSESSED' | 'PLATFORM_TESTED' | 'TASK_VERIFIED' | 'RECOMMENDED';
  addedAt: string;
}

export interface Tag {
  id: number;
  userId: number;
  name: string;
  type: 'MANUAL' | 'AUTO_GENERATED';
  createdAt: string;
}

export interface PrivacySettings {
  id: number;
  userId: number;
  contactsVisibility: 'ALL' | 'EXECUTORS_ONLY' | 'NONE';
  taskStatsVisibility: 'ALL' | 'REGISTERED_ONLY' | 'NONE';
  reviewsVisibility: 'ALL' | 'REGISTERED_ONLY' | 'NONE';
  locationVisibility: 'EXACT' | 'APPROXIMATE' | 'CITY_ONLY' | 'HIDDEN';
}

export interface ProfileUpdateRequest {
  displayName?: string;
  bio?: string;
  email?: string;
  telegram?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  privacyLevel?: 'PUBLIC' | 'REGISTERED_ONLY' | 'LIMITED' | 'PRIVATE';
}

export interface SkillAddRequest {
  name: string;
  category: 'TECHNICAL' | 'CREATIVE' | 'HOUSEHOLD' | 'EDUCATIONAL' | 'BUSINESS';
  level: 1 | 2 | 3 | 4 | 5;
  verificationType?: 'SELF_ASSESSED' | 'PLATFORM_TESTED' | 'TASK_VERIFIED' | 'RECOMMENDED';
}

export interface TagAddRequest {
  name: string;
}

