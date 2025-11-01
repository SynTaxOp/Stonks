package com.stonks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MutualFundMetaDTO {
    private String fundHouse;
    private String schemeType;
    private String schemeCategory;
    private Integer schemeCode;
    private String schemeName;
    private String isinGrowth;
    private String isinDivReinvestment;
}
