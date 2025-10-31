package com.trust.credit.dto;

import jakarta.validation.constraints.*;

public class TransferRequest {
    @NotNull
    private Long toUserId;

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("1000.0")
    private Double amount;

    @Size(max = 500)
    private String description;

    // getters/setters
    public Long getToUserId() { return toUserId; }
    public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

