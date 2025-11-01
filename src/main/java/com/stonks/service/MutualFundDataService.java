package com.stonks.service;

import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDetailDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundNavDTO;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.Optional;

public interface MutualFundDataService {
    List<MutualFundDTO> getAllMutualFunds();

    Optional<MutualFundDTO> getMutualFundBySchemeCode(Integer schemeCode);

    Double getLatestNav(Integer schemeCode);

    Double getYesterdaysNav(Integer schemeCode);

    List<MutualFundNavDTO> getNavHistory(Integer schemeCode);

    Pair<Double, Boolean> getNavForDate(Integer schemeCode, Long epochSeconds);

    Double getNAVFromNAVList(List<MutualFundNavDTO> navData, Long epochSeconds, Integer schemeCode);

    Pair<Double, String> getLatestNavAndNavDate(Integer schemeCode);

    List<MutualFundNavDTO> getBenchmarkNavHistory(String benchmark);

    Integer getBenchmarkSchemeCode(String benchmark);

    List<MutualFundNavDTO> getNifty50NavHistory();

    List<MutualFundNavDTO> getNifty100NavHistory();
}