package com.trust.credit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trust.credit.dto.TransferRequest;
import com.trust.credit.entity.CreditBalance;
import com.trust.credit.entity.Transaction;
import com.trust.credit.service.CreditService;
import com.trust.credit.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CreditController.class)
class CreditControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private CreditService creditService;
    @MockBean
    private TransactionService transactionService;

    @Test
    void getBalance_success() throws Exception {
        CreditBalance balance = new CreditBalance();
        balance.setUserId(1L);
        balance.setAvailableBalance(100.0);
        
        when(creditService.getOrCreateBalance(1L)).thenReturn(balance);
        
        mockMvc.perform(get("/api/credits/1/balance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availableBalance").value(100.0));
    }

    @Test
    void transfer_success() throws Exception {
        TransferRequest request = new TransferRequest();
        request.setToUserId(2L);
        request.setAmount(50.0);
        request.setDescription("Test transfer");
        
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setAmount(50.0);
        
        when(transactionService.createTransfer(eq(1L), eq(2L), eq(50.0), any(), any(), any()))
                .thenReturn(transaction);
        
        mockMvc.perform(post("/api/credits/1/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(50.0));
    }
}

