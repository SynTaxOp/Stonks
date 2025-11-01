package com.stonks.dto.MFAPIDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MutualFundDetailDTO {
    @NotNull(message = "Meta information cannot be null")
    @Valid
    private MutualFundMetaDTO meta;
    
    @NotNull(message = "NAV data cannot be null")
    @Valid
    private List<MutualFundNavDTO> data;
}
