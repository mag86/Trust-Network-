package com.trust.credit.service;

import com.trust.core.api.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditServiceAdapter implements CreditService {
    @Autowired
    private com.trust.credit.service.CreditService creditService;

    @Override
    public int getUserBalance(Long userId) {
        return (int) creditService.getUserBalance(userId);
    }

    @Override
    public void reserveCredits(Long userId, int amount) {
        creditService.reserveCredits(userId, (double) amount);
    }
}

