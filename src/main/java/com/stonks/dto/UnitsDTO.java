package com.stonks.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class UnitsDTO {
    @NotNull(message = "Date cannot be null")
    private String date;
    
    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be a positive number")
    private Double amount;
    
    @NotNull(message = "Units cannot be null")
    @Positive(message = "Units must be a positive number")
    private Double units;

    private String TransactionType;

    private Boolean isSold;

    private String sellDate;
    
    private Double profitLoss;
    
    private Double profitLossPercent;

    private String transactionId;
}
