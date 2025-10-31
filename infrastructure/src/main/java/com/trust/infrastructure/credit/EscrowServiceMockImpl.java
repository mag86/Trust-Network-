package com.trust.infrastructure.credit;

import com.trust.core.escrow.EscrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EscrowServiceMockImpl implements EscrowService {
    private final Map<Long, EscrowRecord> escrows = new ConcurrentHashMap<>();

    @Autowired
    private CreditServiceMockImpl creditService;

    @Override
    public void reserve(Long taskId, Long userId, int amount) {
        creditService.reserveCredits(userId, amount);
        escrows.put(taskId, new EscrowRecord(userId, amount));
    }

    @Override
    public void releaseToExecutor(Long taskId, Long executorId) {
        EscrowRecord rec = escrows.remove(taskId);
        if (rec == null) throw new IllegalStateException("Нет резерва");
        creditService.addCredits(executorId, rec.amount); // Метод добавить кредиты исполнителю
    }

    @Override
    public void refundToCreator(Long taskId, Long creatorId) {
        EscrowRecord rec = escrows.remove(taskId);
        if (rec != null) creditService.addCredits(creatorId, rec.amount);
    }

    private static class EscrowRecord {
        Long creatorId; int amount;
        EscrowRecord(Long c, int a) { creatorId = c; amount = a; }
    }
}
