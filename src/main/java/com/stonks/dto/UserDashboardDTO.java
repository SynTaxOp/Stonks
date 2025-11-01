package com.stonks.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDashboardDTO {
    private String userID;
    private String userName;
    private List<FundSummaryDTO> fundSummaries;
    private Double totalInvested;
    private Double totalValue;
    private Double profitLoss;
    private Double profitLossPercent;
    private Double totalEmergencyFundValue;
    private Double todayProfit;
    private String todayMessage;
}

