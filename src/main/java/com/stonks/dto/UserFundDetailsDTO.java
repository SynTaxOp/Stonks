package com.stonks.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFundDetailsDTO {
    private Optional<UserFundDTO> userFundDTO;
    private List<UnitsDTO> units;
    private Optional<FundSummaryDTO> summary;
    private Optional<FundSummaryExtraDTO> extraSummary;
    private List<SIPDTO> registeredSIPs;
    private Double latestNav;
    private String latestNavDate;
}