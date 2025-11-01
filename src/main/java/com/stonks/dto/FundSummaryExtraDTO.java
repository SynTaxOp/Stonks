package com.stonks.dto;

import lombok.Data;

@Data
public class FundSummaryExtraDTO {
    private Double xirr;
    private Double totalRealizedProfit;
    private Double currentYearTotalRealizedProfit;
    private Double longTermGains;
}
