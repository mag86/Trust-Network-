package com.trust.entity;

import java.time.LocalDateTime;

import com.trust.entity.enums.TransactionType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Transaction {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private User fromUser;
    @ManyToOne
    private User toUser;
    private Double amount;
    private String description;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    private LocalDateTime timestamp;
    private String taskReference;
    // getters/setters/constructors
}
