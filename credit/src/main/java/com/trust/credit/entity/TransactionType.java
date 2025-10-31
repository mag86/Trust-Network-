package com.trust.credit.entity;

public enum TransactionType {
    TRANSFER,      // P2P перевод
    TASK_REWARD,   // Награда за задачу
    SYSTEM_FEE,    // Системная комиссия
    REFUND,        // Возврат средств
    BONUS,         // Бонусные начисления
    ESCROW_RESERVE,// Резервирование escrow
    ESCROW_RELEASE,// Освобождение escrow
    ESCROW_RETURN  // Возврат escrow
}

