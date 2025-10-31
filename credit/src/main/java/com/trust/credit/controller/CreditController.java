package com.trust.credit.controller;

import com.trust.credit.dto.TransferRequest;
import com.trust.credit.entity.CreditBalance;
import com.trust.credit.entity.Transaction;
import com.trust.credit.service.CreditService;
import com.trust.credit.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
@Tag(name = "Credits", description = "API для управления кредитами доверия, переводами и балансом")
public class CreditController {
    @Autowired
    private CreditService creditService;
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{userId}/balance")
    @Operation(summary = "Получение баланса", description = "Получить текущий баланс пользователя (доступный и зарезервированный)")
    public ResponseEntity<CreditBalance> getBalance(@PathVariable Long userId) {
        CreditBalance balance = creditService.getOrCreateBalance(userId);
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/{userId}/transfer")
    @Operation(summary = "P2P перевод кредитов", description = "Перевод кредитов между пользователями с комиссией 5%")
    public ResponseEntity<Transaction> transfer(@PathVariable Long userId,
                                                 @Valid @RequestBody TransferRequest request,
                                                 HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        Transaction transaction = transactionService.createTransfer(
                userId, request.getToUserId(), request.getAmount(),
                request.getDescription(), ipAddress, userAgent);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<String> handleBadRequest(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

