package com.stonks.dto.MFAPIDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MutualFundNavDTO {
    @NotBlank(message = "Date cannot be empty or null")
    @Pattern(regexp = "\\d{2}-\\d{2}-\\d{4}", message = "Date must be in DD-MM-YYYY format")
    private String date;
    
    @NotBlank(message = "NAV cannot be empty or null")
    @Pattern(regexp = "\\d+\\.\\d+", message = "NAV must be a valid decimal number")
    private String nav;
}
