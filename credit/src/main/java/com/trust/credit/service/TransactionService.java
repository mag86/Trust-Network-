package com.trust.credit.service;

import com.trust.credit.entity.Transaction;
import com.trust.credit.entity.TransactionStatus;
import com.trust.credit.entity.TransactionType;
import com.trust.credit.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private CreditService creditService;

    private static final double TRANSFER_FEE_RATE = 0.05; // 5%
    private static final double MIN_FEE = 1.0;
    private static final double MIN_TRANSFER = 1.0;
    private static final double MAX_TRANSFER = 1000.0;

    @Transactional
    public Transaction createTransfer(Long fromUserId, Long toUserId, double amount, 
                                     String description, String ipAddress, String userAgent) {
        // Валидация суммы (FR4.2.2)
        if (amount < MIN_TRANSFER) {
            throw new IllegalArgumentException("Минимальная сумма перевода: " + MIN_TRANSFER);
        }
        if (amount > MAX_TRANSFER) {
            throw new IllegalArgumentException("Максимальная сумма перевода: " + MAX_TRANSFER);
        }
        
        // Расчет комиссии (FR4.2.3)
        double fee = Math.max(amount * TRANSFER_FEE_RATE, MIN_FEE);
        // TODO: Проверка премиум статуса для освобождения от комиссии
        
        // Выполнение перевода
        creditService.transferCredits(fromUserId, toUserId, amount, fee);
        
        // Создание транзакций
        Transaction transfer = new Transaction();
        transfer.setFromUserId(fromUserId);
        transfer.setToUserId(toUserId);
        transfer.setAmount(amount);
        transfer.setType(TransactionType.TRANSFER);
        transfer.setStatus(TransactionStatus.COMPLETED);
        transfer.setDescription(description);
        transfer.setTimestamp(LocalDateTime.now());
        transfer.setFee(fee);
        transfer.setIpAddress(ipAddress);
        transfer.setUserAgent(userAgent);
        transactionRepository.save(transfer);
        
        // Системная комиссия
        Transaction feeTransaction = new Transaction();
        feeTransaction.setFromUserId(fromUserId);
        feeTransaction.setToUserId(null); // Системный счет
        feeTransaction.setAmount(fee);
        feeTransaction.setType(TransactionType.SYSTEM_FEE);
        feeTransaction.setStatus(TransactionStatus.COMPLETED);
        feeTransaction.setDescription("Комиссия за перевод");
        feeTransaction.setTimestamp(LocalDateTime.now());
        transactionRepository.save(feeTransaction);
        
        return transfer;
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByFromUserIdOrToUserIdOrderByTimestampDesc(userId, userId);
    }

    public List<Transaction> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByType(type);
    }

    public List<Transaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByTimestampBetween(start, end);
    }
}

