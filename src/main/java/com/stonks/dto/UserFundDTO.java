package com.stonks.dto;

import com.stonks.model.RegisteredSIP;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFundDTO {
    @NotBlank(message = "User ID cannot be empty or null")
    private String userId;

    @NotNull(message = "Fund ID cannot be null")
    @Positive(message = "Fund ID must be a positive number")
    private Integer fundId;

    @NotBlank(message = "Fund name cannot be empty or null")
    private String fundName;

    @NotNull(message = "isEmergency cannot be null")
    private Boolean isEmergency;

    private String tag;
    private String benchmark;
    private Double units;
    private Double investmentAmount;
}
