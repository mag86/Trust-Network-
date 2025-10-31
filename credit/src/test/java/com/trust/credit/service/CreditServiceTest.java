package com.trust.credit.service;

import com.trust.credit.entity.CreditBalance;
import com.trust.credit.repository.CreditBalanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CreditServiceTest {
    @Mock
    private CreditBalanceRepository balanceRepository;
    @InjectMocks
    private CreditService creditService;

    private CreditBalance balance;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        balance = new CreditBalance();
        balance.setId(1L);
        balance.setUserId(1L);
        balance.setAvailableBalance(100.0);
        balance.setReservedBalance(0.0);
    }

    @Test
    void getUserBalance_success() {
        when(balanceRepository.findByUserId(1L)).thenReturn(Optional.of(balance));
        double result = creditService.getUserBalance(1L);
        assertEquals(100.0, result);
    }

    @Test
    void reserveCredits_success() {
        when(balanceRepository.findByUserId(1L)).thenReturn(Optional.of(balance));
        when(balanceRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        
        creditService.reserveCredits(1L, 50.0);
        
        verify(balanceRepository).save(any(CreditBalance.class));
    }

    @Test
    void reserveCredits_insufficientFunds() {
        when(balanceRepository.findByUserId(1L)).thenReturn(Optional.of(balance));
        assertThrows(IllegalArgumentException.class, () -> creditService.reserveCredits(1L, 150.0));
    }

    @Test
    void addCredits_success() {
        when(balanceRepository.findByUserId(1L)).thenReturn(Optional.of(balance));
        when(balanceRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        
        creditService.addCredits(1L, 50.0);
        
        verify(balanceRepository).save(any(CreditBalance.class));
    }
}

