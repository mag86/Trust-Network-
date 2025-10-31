package com.trust.credit.service;

import com.trust.credit.entity.CreditBalance;
import com.trust.credit.repository.CreditBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class CreditService {
    @Autowired
    private CreditBalanceRepository balanceRepository;

    private static final double INITIAL_BALANCE = 100.0;
    private static final double MIN_BALANCE = 0.0;
    private static final double MAX_BALANCE = 10000.0;
    private static final double DAILY_DEPOSIT_LIMIT = 1000.0;
    private static final double DAILY_TRANSFER_LIMIT = 5000.0;

    @Transactional
    public CreditBalance initializeBalance(Long userId) {
        CreditBalance balance = balanceRepository.findByUserId(userId)
                .orElse(new CreditBalance());
        
        if (balance.getId() == null) {
            balance.setUserId(userId);
            balance.setAvailableBalance(INITIAL_BALANCE);
            balance.setReservedBalance(0.0);
            balance.setCreatedAt(LocalDateTime.now());
            balance.setUpdatedAt(LocalDateTime.now());
            balance = balanceRepository.save(balance);
        }
        
        return balance;
    }

    public double getUserBalance(Long userId) {
        CreditBalance balance = balanceRepository.findByUserId(userId)
                .orElseGet(() -> initializeBalance(userId));
        return balance.getAvailableBalance();
    }

    @Transactional
    public CreditBalance getOrCreateBalance(Long userId) {
        return balanceRepository.findByUserId(userId)
                .orElseGet(() -> initializeBalance(userId));
    }

    @Transactional
    public void reserveCredits(Long userId, double amount) {
        CreditBalance balance = getOrCreateBalance(userId);
        if (balance.getAvailableBalance() < amount) {
            throw new IllegalArgumentException("Недостаточно средств");
        }
        balance.setAvailableBalance(balance.getAvailableBalance() - amount);
        balance.setReservedBalance(balance.getReservedBalance() + amount);
        balance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(balance);
    }

    @Transactional
    public void releaseReservedCredits(Long userId, double amount) {
        CreditBalance balance = getOrCreateBalance(userId);
        if (balance.getReservedBalance() < amount) {
            throw new IllegalArgumentException("Недостаточно зарезервированных средств");
        }
        balance.setReservedBalance(balance.getReservedBalance() - amount);
        balance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(balance);
    }

    @Transactional
    public void addCredits(Long userId, double amount) {
        CreditBalance balance = getOrCreateBalance(userId);
        
        // Проверка лимита пополнения (FR4.1.1)
        resetDailyLimitsIfNeeded(balance);
        if (balance.getDailyDepositAmount() + amount > DAILY_DEPOSIT_LIMIT) {
            throw new IllegalArgumentException("Превышен дневной лимит пополнения");
        }
        
        double newBalance = balance.getAvailableBalance() + amount;
        if (newBalance > MAX_BALANCE) {
            throw new IllegalArgumentException("Превышен максимальный баланс");
        }
        
        balance.setAvailableBalance(newBalance);
        balance.setDailyDepositAmount(balance.getDailyDepositAmount() + amount);
        balance.setLastDepositDate(LocalDateTime.now());
        balance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(balance);
    }

    @Transactional
    public void deductCredits(Long userId, double amount) {
        CreditBalance balance = getOrCreateBalance(userId);
        double newBalance = balance.getAvailableBalance() - amount;
        if (newBalance < MIN_BALANCE) {
            throw new IllegalArgumentException("Недостаточно средств");
        }
        balance.setAvailableBalance(newBalance);
        balance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(balance);
    }

    @Transactional
    public void transferCredits(Long fromUserId, Long toUserId, double amount, double fee) {
        // Проверка лимита переводов (FR4.2.1)
        CreditBalance fromBalance = getOrCreateBalance(fromUserId);
        resetDailyLimitsIfNeeded(fromBalance);
        
        if (fromBalance.getDailyTransferAmount() + amount + fee > DAILY_TRANSFER_LIMIT) {
            throw new IllegalArgumentException("Превышен дневной лимит переводов");
        }
        
        // Списание с отправителя
        double totalDeduct = amount + fee;
        double newFromBalance = fromBalance.getAvailableBalance() - totalDeduct;
        if (newFromBalance < MIN_BALANCE) {
            throw new IllegalArgumentException("Недостаточно средств");
        }
        
        fromBalance.setAvailableBalance(newFromBalance);
        fromBalance.setDailyTransferAmount(fromBalance.getDailyTransferAmount() + amount + fee);
        fromBalance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(fromBalance);
        
        // Зачисление получателю
        CreditBalance toBalance = getOrCreateBalance(toUserId);
        double newToBalance = toBalance.getAvailableBalance() + amount;
        if (newToBalance > MAX_BALANCE) {
            throw new IllegalArgumentException("Баланс получателя превысит максимум");
        }
        toBalance.setAvailableBalance(newToBalance);
        toBalance.setUpdatedAt(LocalDateTime.now());
        balanceRepository.save(toBalance);
    }

    private void resetDailyLimitsIfNeeded(CreditBalance balance) {
        if (balance.getLastDepositDate() == null || 
            ChronoUnit.DAYS.between(balance.getLastDepositDate(), LocalDateTime.now()) >= 1) {
            balance.setDailyDepositAmount(0.0);
            balance.setDailyTransferAmount(0.0);
            balance.setLastDepositDate(LocalDateTime.now());
        }
    }
}

