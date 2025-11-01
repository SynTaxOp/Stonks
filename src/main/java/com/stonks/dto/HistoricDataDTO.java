package com.stonks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HistoricDataDTO {
    String month;
    Double totalValue;
    Double totalValueBenchmark;
    Double totalValueNifty50;
    Double totalValueNifty100;
    Double totalInvested;
    Double totalProfit;
    Double thisMonthInvested;
    Double thisMonthProfit;
    Double growthPercent;
    Double alphaPercent;

    public HistoricDataDTO(HistoricDataDTO other) {
        this.month = other.getMonth();
        this.totalValue = other.getTotalValue();
        this.totalProfit = other.getTotalProfit();
        this.totalInvested = other.getTotalInvested();
        this.thisMonthProfit = other.getThisMonthProfit();
        this.thisMonthInvested = other.getThisMonthInvested();
        this.growthPercent = other.getGrowthPercent();
        this.alphaPercent = other.getAlphaPercent();
        this.totalValueBenchmark = other.getTotalValueBenchmark();
        this.totalValueNifty50 = other.getTotalValueNifty50();
        this.totalValueNifty100 = other.getTotalValueNifty100();
    }
}
