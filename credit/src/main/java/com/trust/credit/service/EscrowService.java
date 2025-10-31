package com.trust.credit.service;

import com.trust.credit.entity.EscrowTransaction;
import com.trust.credit.entity.EscrowStatus;
import com.trust.credit.repository.EscrowTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EscrowService {
    @Autowired
    private EscrowTransactionRepository escrowRepository;
    @Autowired
    private CreditService creditService;
    @Autowired
    private TransactionService transactionService;

    @Transactional
    public EscrowTransaction reserve(Long taskId, Long creatorId, double amount) {
        // Резервирование средств (FR4.3.1)
        creditService.reserveCredits(creatorId, amount);
        
        EscrowTransaction escrow = new EscrowTransaction();
        escrow.setTaskId(taskId);
        escrow.setCreatorId(creatorId);
        escrow.setAmount(amount);
        escrow.setStatus(EscrowStatus.RESERVED);
        escrow.setCreatedAt(LocalDateTime.now());
        return escrowRepository.save(escrow);
    }

    @Transactional
    public void releaseToExecutor(Long taskId, Long executorId) {
        EscrowTransaction escrow = escrowRepository.findByTaskId(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow не найден"));
        
        if (escrow.getStatus() != EscrowStatus.RESERVED) {
            throw new IllegalStateException("Escrow не в статусе RESERVED");
        }
        
        // Освобождение резерва
        creditService.releaseReservedCredits(escrow.getCreatorId(), escrow.getAmount());
        // Перечисление исполнителю
        creditService.addCredits(executorId, escrow.getAmount());
        
        escrow.setStatus(EscrowStatus.RELEASED);
        escrow.setExecutorId(executorId);
        escrow.setReleasedAt(LocalDateTime.now());
        escrowRepository.save(escrow);
        
        // Создание транзакции награды (FR4.4.2)
        // TODO: Создать транзакцию через TransactionService
    }

    @Transactional
    public void returnToCreator(Long taskId) {
        EscrowTransaction escrow = escrowRepository.findByTaskId(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow не найден"));
        
        if (escrow.getStatus() != EscrowStatus.RESERVED) {
            throw new IllegalStateException("Escrow не в статусе RESERVED");
        }
        
        // Возврат резерва
        creditService.releaseReservedCredits(escrow.getCreatorId(), escrow.getAmount());
        creditService.addCredits(escrow.getCreatorId(), escrow.getAmount());
        
        escrow.setStatus(EscrowStatus.RETURNED);
        escrow.setReturnedAt(LocalDateTime.now());
        escrowRepository.save(escrow);
    }
}

