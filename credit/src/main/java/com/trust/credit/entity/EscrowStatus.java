package com.trust.credit.entity;

public enum EscrowStatus {
    RESERVED,  // Средства зарезервированы
    RELEASED,  // Средства переведены исполнителю
    RETURNED,  // Средства возвращены создателю
    DISPUTED   // Транзакция оспорена
}

