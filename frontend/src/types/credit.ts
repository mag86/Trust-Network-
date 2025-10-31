// Типы для модуля кредитов

export interface CreditBalance {
  id: number;
  userId: number;
  availableBalance: number;
  reservedBalance: number;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  fromUserId: number | null;
  toUserId: number | null;
  amount: number;
  type: 'TRANSFER' | 'TASK_REWARD' | 'SYSTEM_FEE' | 'REFUND' | 'BONUS' | 'ESCROW_RESERVE' | 'ESCROW_RELEASE' | 'ESCROW_RETURN';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description?: string;
  fee?: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  taskId?: number;
}

export interface TransferRequest {
  toUserId: number;
  amount: number;
  description?: string;
}

export interface TransferConfirmation {
  toUserId: number;
  toUserName?: string;
  amount: number;
  fee: number;
  total: number;
  description?: string;
}

