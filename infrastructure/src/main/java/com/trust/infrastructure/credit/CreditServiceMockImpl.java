package com.trust.infrastructure.credit;

import com.trust.core.api.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Qualifier("mockCreditService")
public class CreditServiceMockImpl implements CreditService {
    private final Map<Long, Integer> balance = new ConcurrentHashMap<>();

    @Override
    public int getUserBalance(Long userId) {
        return balance.computeIfAbsent(userId, id -> 100); // по-умолчанию 100
    }

    @Override
    public void reserveCredits(Long userId, int amount) {
        int current = getUserBalance(userId);
        if (current < amount) throw new IllegalArgumentException("Недостаточно средств на резерв");
        balance.put(userId, current - amount);
    }

    public void addCredits(Long userId, int amount) {
        int current = getUserBalance(userId);
        balance.put(userId, current + amount);
    }
}
