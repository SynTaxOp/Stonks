package com.stonks.service;

import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.UserDashboardDTO;
import com.stonks.dto.UserDashboardExtraDTO;

import java.util.List;
import java.util.Optional;

public interface DashboardPageService {

    Optional<UserDashboardDTO> getUserDashboard(String userId);

    Optional<UserDashboardExtraDTO> getUserDashboardExtra(String userId);

    List<HistoricDataDTO> getCombinedHistoricData(String userId);

    List<MutualFundDTO> getAllFundSearchResults(String searchText);

    List<String> getQuotes();
}
