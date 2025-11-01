package com.stonks.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class FundDTO {
    @NotBlank(message = "Fund name cannot be empty or null")
    private String name;
    
    @NotNull(message = "Fund ID cannot be null")
    @Positive(message = "Fund ID must be a positive number")
    private Integer id;
}
