package com.stonks.service;

import com.stonks.dto.FundSummaryDTO;
import com.stonks.dto.FundSummaryExtraDTO;
import com.stonks.dto.HistoricChartDTO;
import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.SIPDTO;
import com.stonks.dto.TransactionDTO;
import com.stonks.dto.UserFundDTO;
import com.stonks.dto.UserFundDetailsDTO;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface UserFundService {
    List<UserFundDTO> getUserFundsByUserId(String userId);

    Optional<UserFundDTO> getUserFundById(String id);

    Optional<UserFundDTO> getUserFundByUserIdAndFundId(String userId, Integer fundId);

    List<UserFundDTO> getUserFundsByUserIdAndTag(String userId, String tag);

    List<UserFundDTO> getEmergencyFundsByUserId(String userId);

    String createUserFund(UserFundDTO userFundDTO);

    String updateUserFund(String id, UserFundDTO userFundDTO);

    String updateUserFundByUserIdAndFundId(String userId, Integer fundId, UserFundDTO userFundDTO);

    List<String> getAllBenchmarkStrings();

    String refreshUserFundByUserIdAndFundId(String userId, Integer fundId);

    String deleteUserFund(String id);

    String deleteUserFundByUserIdAndFundId(String userId, Integer fundId);

    String deleteAllUserFundsByUserId(String userId);

    String existsUserFundByUserIdAndFundId(String userId, Integer fundId);

    Optional<FundSummaryDTO> getFundSummary(String userId, Integer fundId);

    CompletableFuture<Optional<FundSummaryDTO>> getFundSummaryAsync(String userId, Integer fundId);

    Optional<FundSummaryExtraDTO> getFundSummaryExtra(String userId, Integer fundId);

    Optional<UserFundDetailsDTO> getUserFundDetails(String userId, Integer fundId);

    List<HistoricDataDTO> getPerformanceChart(String userId, Integer fundId);

    Optional<HistoricChartDTO> getHistoricChart(Integer fundId);


    CompletableFuture<List<HistoricDataDTO>> getHistoricDataAsync(String userId, Integer fundId);

    Boolean registerNewSIP(SIPDTO sipdto);

    String addTransaction(TransactionDTO transactionDTO);

    String addBulkTransactions(List<TransactionDTO> transactionDTOList);

    String deleteTransaction(String transactionId);
}