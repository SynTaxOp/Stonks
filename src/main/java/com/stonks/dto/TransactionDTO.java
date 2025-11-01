package com.stonks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class  TransactionDTO {
    private String id;

    // User Inputs.
    @NotBlank(message = "Fund name cannot be empty or null")
    private String fundName;

    @NotNull(message = "Fund ID cannot be null")
    @Positive(message = "Fund ID must be a positive number")
    private Integer fundId;

    private Double amount;

    @NotNull(message = "Date cannot be null")
    private String date;

    @NotBlank(message = "User ID cannot be empty or null")
    private String userId;


    @NotBlank(message = "Transaction type cannot be empty or null")
    private String transactionType;

    private Double units;

    // Backend Computed.
    private Boolean isRedeemed;
    private String sellDate;
    private Double price;
    private Double bookedProfit;
    private Boolean isUpdated;
}