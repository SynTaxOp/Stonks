package com.stonks.dto.MFAPIDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MutualFundMetaDTO {
    @NotBlank(message = "Fund house cannot be empty or null")
    private String fundHouse;
    
    @NotBlank(message = "Scheme type cannot be empty or null")
    private String schemeType;
    
    @NotBlank(message = "Scheme category cannot be empty or null")
    private String schemeCategory;
    
    @NotNull(message = "Scheme code cannot be null")
    @Positive(message = "Scheme code must be a positive number")
    private Integer schemeCode;
    
    @NotBlank(message = "Scheme name cannot be empty or null")
    private String schemeName;
    
    private String isinGrowth;
    
    private String isinDivReinvestment;
}
