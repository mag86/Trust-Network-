package com.trust.auth.entity;

public enum UserStatus {
    PENDING_VERIFICATION, // Не подтвержден email
    ACTIVE,              // Активен
    BLOCKED,             // Заблокирован
    DELETED              // Удален (soft delete)
}

