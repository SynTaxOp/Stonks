package com.stonks.dto;

import lombok.Data;

import java.util.List;

@Data
public class HistoricChartDTO {
    List<NavDateDTO> historicNAVs;
}
