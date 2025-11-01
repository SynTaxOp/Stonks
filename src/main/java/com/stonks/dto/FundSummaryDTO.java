package com.stonks.dto;

import lombok.Data;

@Data
public class FundSummaryDTO {
    private String name;
    private Integer fundId;
    private String tag;
    private Boolean isEmergency;
    private Double totalInvested;
    private Double totalValue;
    private Double totalUnits;
    private Double profitLoss;
    private Double profitLossPercent;
    private Double todayProfit;
}

