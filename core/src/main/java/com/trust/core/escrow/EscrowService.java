package com.trust.core.escrow;

public interface EscrowService {
    void reserve(Long taskId, Long userId, int amount);
    void releaseToExecutor(Long taskId, Long executorId);
    void refundToCreator(Long taskId, Long creatorId);
}
