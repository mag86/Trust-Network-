package com.trust.credit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_balances")
public class CreditBalance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private Double availableBalance = 0.0;

    @Column(nullable = false)
    private Double reservedBalance = 0.0; // Escrow

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime lastDepositDate;

    private Double dailyDepositAmount = 0.0;

    private Double dailyTransferAmount = 0.0;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getAvailableBalance() { return availableBalance; }
    public void setAvailableBalance(Double availableBalance) { this.availableBalance = availableBalance; }
    public Double getReservedBalance() { return reservedBalance; }
    public void setReservedBalance(Double reservedBalance) { this.reservedBalance = reservedBalance; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getLastDepositDate() { return lastDepositDate; }
    public void setLastDepositDate(LocalDateTime lastDepositDate) { this.lastDepositDate = lastDepositDate; }
    public Double getDailyDepositAmount() { return dailyDepositAmount; }
    public void setDailyDepositAmount(Double dailyDepositAmount) { this.dailyDepositAmount = dailyDepositAmount; }
    public Double getDailyTransferAmount() { return dailyTransferAmount; }
    public void setDailyTransferAmount(Double dailyTransferAmount) { this.dailyTransferAmount = dailyTransferAmount; }
}

