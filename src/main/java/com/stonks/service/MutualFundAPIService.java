package com.stonks.service;

import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDetailDTO;

import java.util.List;
import java.util.Optional;

public interface MutualFundAPIService {
    List<MutualFundDTO> getAllMutualFunds();

    Optional<MutualFundDetailDTO> getMutualFundDetails(Integer schemeCode);

    Double getLatestNAV(Integer schemeCode);
}
