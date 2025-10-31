// Типы для модуля репутации

export type ReputationLevel = 'NOVICE' | 'EXPERIENCED' | 'EXPERT' | 'MASTER';
export type BadgeType = 'ACTIVITY' | 'QUALITY' | 'COMMUNITY' | 'SPECIALIZATION';

export interface TrustScore {
  id: number;
  userId: number;
  score: number;
  level: ReputationLevel;
  completionRate: number;
  averageRating: number;
  responseRate: number;
  transactionVolume: number;
  accountAge: number;
  verificationLevel: number;
  communityEndorsements: number;
  lastUpdated: string;
}

export interface Review {
  id: number;
  taskId: number;
  authorId: number;
  targetUserId: number;
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
  valueRating: number;
  overallRating: number;
  publicComment?: string;
  privateComment?: string;
  reply?: string;
  createdAt: string;
  editedAt?: string;
}

export interface ReviewCreateRequest {
  taskId: number;
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
  valueRating: number;
  publicComment?: string;
  privateComment?: string;
}

export interface Badge {
  id: number;
  userId: number;
  type: BadgeType;
  name: string;
  description: string;
  isRare: boolean;
  earnedAt: string;
  icon?: string;
}

export interface TrustScoreFactors {
  completionRate: number;
  averageRating: number;
  responseRate: number;
  transactionVolume: number;
  accountAge: number;
  verificationLevel: number;
  communityEndorsements: number;
}

