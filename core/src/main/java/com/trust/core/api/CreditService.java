package com.trust.core.api;

public interface CreditService {
    int getUserBalance(Long userId);
    void reserveCredits(Long userId, int amount);
}
