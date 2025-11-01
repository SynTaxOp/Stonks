package com.stonks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SIPDTO {
    private String id;
    
    @NotBlank(message = "Fund name cannot be empty or null")
    private String fundName;
    
    @NotNull(message = "Fund ID cannot be null")
    @Positive(message = "Fund ID must be a positive number")
    private Integer fundId;
    
    @NotBlank(message = "User ID cannot be empty or null")
    private String userId;
    
    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be a positive number")
    private Double amount;
}