package com.stonks.service.impl;

import com.stonks.dto.FundSummaryDTO;
import com.stonks.dto.FundSummaryExtraDTO;
import com.stonks.dto.HistoricChartDTO;
import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundNavDTO;
import com.stonks.dto.NavDateDTO;
import com.stonks.dto.SIPDTO;
import com.stonks.dto.TransactionDTO;
import com.stonks.dto.UnitsDTO;
import com.stonks.dto.UserFundDTO;
import com.stonks.dto.UserFundDetailsDTO;
import com.stonks.exception.ApiException;
import com.stonks.model.Transaction;
import com.stonks.model.UserFund;
import com.stonks.repository.UserFundRepository;
import com.stonks.service.MutualFundDataService;
import com.stonks.service.SIPService;
import com.stonks.service.TransactionService;
import com.stonks.service.UserFundService;

import com.stonks.util.Response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static com.stonks.util.TimeUtils.getEndOfMonthEpochIST;
import static com.stonks.util.TimeUtils.getMonthStringFromEpochIST;
import static com.stonks.util.TimeUtils.getNextMonthEpochIST;
import static com.stonks.util.TimeUtils.getStartOfMonthEpochIST;
import static com.stonks.util.TimeUtils.isISTDateStringInCurrentFinancialYear;
import static com.stonks.util.TimeUtils.isOneYearOrMoreOld;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFundServiceImpl implements UserFundService {

    private final UserFundRepository userFundRepository;
    private final TransactionService transactionService;
    private final SIPService sipService;
    private final MutualFundDataService mfapiService;
    private static final Integer Nifty50SchemeCode = 119063;
    private static final Integer Nifty100SchemeCode = 149868;

    @Override
    public List<UserFundDTO> getUserFundsByUserId(String userId) {
        try {
            log.info("Getting all user funds for user: {}", userId);

            List<UserFund> userFunds = userFundRepository.findByUserId(userId);
            List<UserFundDTO> userFundDTOs = userFunds.stream().map(this::convertToDTO).collect(Collectors.toList());

            log.info("Found {} user funds for user: {}", userFundDTOs.size(), userId);
            return userFundDTOs;
        } catch (Exception e) {
            log.error("Error getting user funds for user: {}", userId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public Optional<UserFundDTO> getUserFundById(String id) {
        try {
            log.info("Getting user fund by ID: {}", id);

            return userFundRepository.findById(id).map(userFund -> {
                log.info("Found user fund with ID: {}", id);
                return convertToDTO(userFund);
            });
        } catch (Exception e) {
            log.error("Error getting user fund with ID: {}", id, e);
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserFundDTO> getUserFundByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.info("Getting user fund for user: {} and fund: {}", userId, fundId);

            List<UserFund> userFunds = userFundRepository.findByUserIdAndFundId(userId, fundId);
            if (!userFunds.isEmpty()) {
                UserFundDTO userFundDTO = convertToDTO(userFunds.get(0));
                log.info("Found user fund for user: {} and fund: {}", userId, fundId);
                return Optional.of(userFundDTO);
            } else {
                log.warn("User fund not found for user: {} and fund: {}", userId, fundId);
                return Optional.empty();
            }
        } catch (Exception e) {
            log.error("Error getting user fund for user: {} and fund: {}", userId, fundId, e);
            return Optional.empty();
        }
    }

    @Override
    public List<UserFundDTO> getUserFundsByUserIdAndTag(String userId, String tag) {
        try {
            log.info("Getting user funds for user: {} and tag: {}", userId, tag);

            List<UserFund> userFunds = userFundRepository.findByUserIdAndTag(userId, tag);
            List<UserFundDTO> userFundDTOs = userFunds.stream().map(this::convertToDTO).collect(Collectors.toList());

            log.info("Found {} user funds for user: {} and tag: {}", userFundDTOs.size(), userId, tag);
            return userFundDTOs;
        } catch (Exception e) {
            log.error("Error getting user funds for user: {} and tag: {}", userId, tag, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserFundDTO> getEmergencyFundsByUserId(String userId) {
        try {
            log.info("Getting emergency funds for user: {}", userId);

            List<UserFund> allUserFunds = userFundRepository.findByUserId(userId);
            List<UserFundDTO> emergencyFunds = allUserFunds.stream().filter(fund -> Boolean.TRUE.equals(fund.getIsEmergency())).map(this::convertToDTO).collect(Collectors.toList());

            log.info("Found {} emergency funds for user: {}", emergencyFunds.size(), userId);
            return emergencyFunds;
        } catch (Exception e) {
            log.error("Error getting emergency funds for user: {}", userId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public String createUserFund(UserFundDTO userFundDTO) {
        try {
            log.info("Creating user fund for user: {} and fund: {}", userFundDTO.getUserId(), userFundDTO.getFundId());

            if (existsUserFundByUserIdAndFundId(userFundDTO.getUserId(), userFundDTO.getFundId()).equals("true")) {
                log.warn("User fund already exists for user: {} and fund: {}", userFundDTO.getUserId(), userFundDTO.getFundId());
                return "Error: User fund already exists for this user and fund combination";
            }

            UserFund userFund = convertToEntity(userFundDTO);
            UserFund savedUserFund = userFundRepository.save(userFund);
            log.info("User fund created successfully with ID: {}", savedUserFund.getId());
            return "Success: User fund created successfully with ID: " + savedUserFund.getId();
        } catch (Exception e) {
            log.error("Error creating user fund for user: {} and fund: {}", userFundDTO.getUserId(), userFundDTO.getFundId(), e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String updateUserFund(String id, UserFundDTO userFundDTO) {
        try {
            log.info("Updating user fund with ID: {}", id);

            return userFundRepository.findById(id).map(existingUserFund -> {
                existingUserFund.setUserId(userFundDTO.getUserId());
                existingUserFund.setFundId(userFundDTO.getFundId());
                existingUserFund.setFundName(userFundDTO.getFundName());
                existingUserFund.setIsEmergency(userFundDTO.getIsEmergency());
                existingUserFund.setTag(userFundDTO.getTag());
                UserFund updatedUserFund = userFundRepository.save(existingUserFund);
                log.info("User fund with ID: {} updated successfully", id);
                return "Success: User fund updated successfully with ID: " + id;
            }).orElseGet(() -> {
                log.warn("User fund not found with ID: {}", id);
                return "Error: User fund not found with ID: " + id;
            });
        } catch (Exception e) {
            log.error("Error updating user fund with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String updateUserFundByUserIdAndFundId(String userId, Integer fundId, UserFundDTO userFundDTO) {
        try {
            log.info("Updating user fund for user: {} and fund: {}", userId, fundId);

            List<UserFund> userFunds = userFundRepository.findByUserIdAndFundId(userId, fundId);
            if (!userFunds.isEmpty()) {
                UserFund existingUserFund = userFunds.getFirst();
                existingUserFund.setFundName(userFundDTO.getFundName());
                existingUserFund.setIsEmergency(userFundDTO.getIsEmergency());
                existingUserFund.setTag(userFundDTO.getTag());
                existingUserFund.setBenchmark(userFundDTO.getBenchmark());
                existingUserFund.setInvestmentAmount(userFundDTO.getInvestmentAmount());
                existingUserFund.setUnits(userFundDTO.getUnits());
                UserFund updatedUserFund = userFundRepository.save(existingUserFund);
                log.info("User fund for user: {} and fund: {} updated successfully", userId, fundId);
                return "Success: User fund updated successfully for user: " + userId + " and fund: " + fundId;
            } else {
                log.warn("No user fund found for user: {} and fund: {} for update", userId, fundId);
                return "Error: User fund not found for user: " + userId + " and fund: " + fundId;
            }
        } catch (Exception e) {
            log.error("Error updating user fund for user: {} and fund: {}", userId, fundId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public List<String> getAllBenchmarkStrings() {
        return List.of("Nifty 100", "Nifty 500", "Nifty 150 Midcap", "Nifty 250 Smallcap", "Nifty Dividend Opportunities", "NASDAQ 100");
    }

    private String getBenchmarkEnumForUserFund(String userId, Integer fundId) {
        Optional<UserFundDTO> userFundDTO = getUserFundByUserIdAndFundId(userId, fundId);
        return userFundDTO.get().getBenchmark();
    }

    @Override
    public String refreshUserFundByUserIdAndFundId(String userId, Integer fundId) {
        Pair<Double, Double> result = transactionService.getTotalUnitsAndInvestedAmount(userId, fundId);
        Optional<UserFundDTO> data = getUserFundByUserIdAndFundId(userId, fundId);
        if (data.isPresent()) {
            UserFundDTO userFund = data.get();
            userFund.setUnits(result.getFirst());
            userFund.setInvestmentAmount(result.getSecond());
            updateUserFundByUserIdAndFundId(userId, fundId, userFund);
            return "Success: User fund refreshed successfully for user: " + userId + " and fund: " + fundId;

        } else {
            return "Error: User fund not found for user: " + userId + " and fund: " + fundId;
        }
    }


    @Override
    public String deleteUserFund(String id) {
        try {
            log.info("Deleting user fund with ID: {}", id);

            if (userFundRepository.existsById(id)) {
                userFundRepository.deleteById(id);
                log.info("User fund with ID: {} deleted successfully", id);
                return "Success: User fund deleted successfully with ID: " + id;
            } else {
                log.warn("User fund with ID: {} not found for deletion", id);
                return "Error: User fund not found with ID: " + id;
            }
        } catch (Exception e) {
            log.error("Error deleting user fund with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteUserFundByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.info("Deleting user fund for user: {} and fund: {}", userId, fundId);

            List<UserFund> userFundsToDelete = userFundRepository.findByUserIdAndFundId(userId, fundId);
            if (!userFundsToDelete.isEmpty()) {
                userFundRepository.deleteAll(userFundsToDelete);
                log.info("User funds for user: {} and fund: {} deleted successfully", userId, fundId);
                String result = transactionService.deleteTransactionsByUserIdAndFundId(userId, fundId);
                if (result.startsWith("Error:")) {
                    return result;
                }
                result = sipService.deleteSIPByUserIdAndFundId(userId, fundId);
                if (result.startsWith("Error:")) {
                    return result;
                }
                return "Success: User fund deleted successfully for user: " + userId + " and fund: " + fundId;
            } else {
                log.warn("No user funds found for user: {} and fund: {} for deletion", userId, fundId);
                return "Error: User fund not found for user: " + userId + " and fund: " + fundId;
            }

        } catch (Exception e) {
            log.error("Error deleting user fund for user: {} and fund: {}", userId, fundId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteAllUserFundsByUserId(String userId) {
        try {
            log.info("Deleting all user funds for user: {}", userId);

            List<UserFund> userFundsToDelete = userFundRepository.findByUserId(userId);
            long count = userFundsToDelete.size();
            if (count > 0) {
                userFundRepository.deleteAll(userFundsToDelete);
                log.info("{} user funds deleted for user: {}", count, userId);
                String result = transactionService.deleteTransactionsByUserId(userId);
                if (result.startsWith("Error:")) {
                    return result;
                }
                result = sipService.deleteAllSIPsByUserId(userId);
                if (result.startsWith("Error:")) {
                    return result;
                }
                return "Success: " + count + " user funds deleted for user: " + userId;
            } else {
                log.info("No user funds found for user: {}", userId);
                return "Success: No user funds found for user: " + userId;
            }
        } catch (Exception e) {
            log.error("Error deleting all user funds for user: {}", userId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String existsUserFundByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.debug("Checking if user fund exists for user: {} and fund: {}", userId, fundId);

            List<UserFund> userFunds = userFundRepository.findByUserIdAndFundId(userId, fundId);
            boolean exists = !userFunds.isEmpty();

            log.debug("User fund exists for user: {} and fund: {} = {}", userId, fundId, exists);
            return String.valueOf(exists);
        } catch (Exception e) {
            log.error("Error checking if user fund exists for user: {} and fund: {}", userId, fundId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public Optional<FundSummaryDTO> getFundSummary(String userId, Integer fundId) {
        log.info("Getting fund summary for user: {} and fund: {}", userId, fundId);

        try {
            // Get user fund details
            Optional<UserFund> userFundOpt = userFundRepository.findByUserIdAndFundId(userId, fundId).stream().findFirst();

            if (userFundOpt.isEmpty()) {
                log.warn("User fund not found for user: {} and fund: {}", userId, fundId);
                return Optional.empty();
            }

            UserFund userFund = userFundOpt.get();

            if (userFund.getUnits() == null) {
                Pair<Double, Double> result = transactionService.getTotalUnitsAndInvestedAmount(userFund.getUserId(), userFund.getFundId());
                userFund.setUnits(result.getFirst());
                if (userFund.getInvestmentAmount() == null) {
                    userFund.setInvestmentAmount(result.getSecond());
                }
                userFundRepository.save(userFund);
            }

            Double currentNAV = mfapiService.getLatestNav(fundId);
            Double currentValue = currentNAV * userFund.getUnits();
            Double yesterdayNav = mfapiService.getYesterdaysNav(userFund.getFundId());
            Double yesterdayValue = (userFund.getUnits() * Objects.requireNonNullElse(yesterdayNav, currentNAV));

            // Calculate profit/loss
            Double profitLoss = currentValue - userFund.getInvestmentAmount();
            Double profitLossPercent = (profitLoss / userFund.getInvestmentAmount()) * 100.0;
            Double todayProfit = currentValue - yesterdayValue;


            // Build fund summary
            FundSummaryDTO fundSummary = new FundSummaryDTO();
            fundSummary.setName(userFund.getFundName());
            fundSummary.setFundId(fundId);
            fundSummary.setTag(userFund.getTag());
            fundSummary.setIsEmergency(userFund.getIsEmergency());
            fundSummary.setTotalInvested(userFund.getInvestmentAmount());
            fundSummary.setTotalValue(currentValue);
            fundSummary.setTotalUnits(userFund.getUnits());
            fundSummary.setProfitLoss(profitLoss);
            fundSummary.setProfitLossPercent(profitLossPercent);
            fundSummary.setTodayProfit(todayProfit);

            log.info("Successfully calculated fund summary for user: {} and fund: {}", userId, fundId);
            return Optional.of(fundSummary);

        } catch (Exception e) {
            log.error("Error calculating fund summary for user: {} and fund: {}", userId, fundId, e);
            return Optional.empty();
        }
    }

    // async wrapper version
    @Async
    public CompletableFuture<Optional<FundSummaryDTO>> getFundSummaryAsync(String userId, Integer fundId) {
        return CompletableFuture.supplyAsync(() -> getFundSummary(userId, fundId));
    }

    @Override
    public Optional<FundSummaryExtraDTO> getFundSummaryExtra(String userId, Integer fundId) {
        log.info("Getting fund summary for user: {} and fund: {}", userId, fundId);

        try {
            // Get transactions
            List<TransactionDTO> transactions = transactionService.getTransactionsByUserIdAndFundId(userId, fundId);

            TransactionsCalculationResult result = calculateUnitsAndCurrentValue(transactions, fundId);
            Double xirr = transactionService.calculateXIRR(transactions, result.currentValue);

            // Build fund summary extra
            FundSummaryExtraDTO fundSummaryExtra = new FundSummaryExtraDTO();
            fundSummaryExtra.setXirr(xirr);
            fundSummaryExtra.setLongTermGains(result.longTermGains);
            fundSummaryExtra.setTotalRealizedProfit(result.totalRealizedProfit);
            fundSummaryExtra.setCurrentYearTotalRealizedProfit(result.currentYearTotalRealizedProfit);
            return Optional.of(fundSummaryExtra);

        } catch (Exception e) {
            log.error("Error calculating fund summary for user: {} and fund: {}", userId, fundId, e);
            return Optional.empty();
        }
    }

    private TransactionsCalculationResult calculateUnitsAndCurrentValue(List<TransactionDTO> transactions, Integer fundId) {
        Double totalUnits = 0.0;
        Double currentValue = 0.0;
        Double totalInvested = 0.0;
        Double totalRealizedProfit = 0.0;
        Double currentYearTotalRealizedProfit = 0.0;
        Double longTermInvestment = 0.0;
        Double longTermUnits = 0.0;
        Double longTermGains = 0.0;

        // Calculate total units from BUY transactions
        for (TransactionDTO transaction : transactions) {
            if ("BUY".equalsIgnoreCase(transaction.getTransactionType())) {
                if (!transaction.getIsRedeemed()) {
                    totalUnits += transaction.getUnits();
                    totalInvested += transaction.getAmount();
                    if (isOneYearOrMoreOld(transaction.getDate())) {
                        longTermUnits += transaction.getUnits();
                        longTermInvestment += transaction.getAmount();
                    }
                } else {
                    totalRealizedProfit += transaction.getBookedProfit();
                    if (isISTDateStringInCurrentFinancialYear(transaction.getSellDate())) {
                        currentYearTotalRealizedProfit += transaction.getBookedProfit();
                    }
                }
            }
        }

        // Get current NAV
        try {
            Double currentNav = mfapiService.getLatestNav(fundId);
            if (currentNav != null) {
                currentValue = totalUnits * currentNav;
                longTermGains = (longTermUnits * currentNav) - longTermInvestment;
            }
        } catch (Exception e) {
            log.warn("Failed to get current NAV for fundId: {}", fundId, e);
        }

        return new TransactionsCalculationResult(totalInvested, currentValue, totalUnits, totalRealizedProfit, currentYearTotalRealizedProfit, longTermGains);
    }


    List<UnitsDTO> getFundUnits(String userId, Integer fundId) {
        List<UnitsDTO> units = new ArrayList<>();
        Double currentNAV = mfapiService.getLatestNav(fundId);
        List<TransactionDTO> transactions = transactionService.getTransactionsByUserIdAndFundId(userId, fundId);
        for (TransactionDTO transaction : transactions) {
            UnitsDTO recordedUnit = new UnitsDTO();
            recordedUnit.setDate(transaction.getDate());
            recordedUnit.setUnits(transaction.getUnits());
            recordedUnit.setAmount(transaction.getAmount());
            recordedUnit.setTransactionType(transaction.getTransactionType());
            recordedUnit.setTransactionId(transaction.getId());
            if (Objects.equals(recordedUnit.getTransactionType(), "BUY")) {
                if (transaction.getIsRedeemed()) {
                    recordedUnit.setIsSold(true);
                    recordedUnit.setSellDate(transaction.getSellDate());
                    recordedUnit.setProfitLoss((transaction.getBookedProfit()));
                    recordedUnit.setProfitLossPercent((transaction.getBookedProfit() / transaction.getAmount()) * 100.0);
                } else {
                    recordedUnit.setIsSold(false);
                    recordedUnit.setProfitLoss((currentNAV - transaction.getPrice()) * transaction.getUnits());
                    recordedUnit.setProfitLossPercent(((currentNAV - transaction.getPrice()) / transaction.getPrice()) * 100.0);
                }
            } else {
                recordedUnit.setProfitLoss(transaction.getBookedProfit());
                recordedUnit.setProfitLossPercent((transaction.getBookedProfit() / (transaction.getAmount() - transaction.getBookedProfit())) * 100.0);
            }
            units.add(recordedUnit);
        }
        return units;
    }


    // Helper class for units calculation result
    @Getter
    @AllArgsConstructor
    private static class TransactionsCalculationResult {

        private final Double totalInvested;
        private final Double currentValue;
        private final Double totalUnits;
        private final Double totalRealizedProfit;
        private final Double currentYearTotalRealizedProfit;
        private final Double longTermGains;
    }


    public Optional<UserFundDetailsDTO> getUserFundDetails(String userId, Integer fundId) {
        Pair<Double, String> latestNav = mfapiService.getLatestNavAndNavDate(fundId);
        Optional<FundSummaryDTO> summary = getFundSummary(userId, fundId);
        Optional<FundSummaryExtraDTO> extraSummary = getFundSummaryExtra(userId, fundId);
        Optional<UserFundDTO> userFund = getUserFundByUserIdAndFundId(userId, fundId);
        List<SIPDTO> registeredSIPs = sipService.getSIPsByUserIdAndFundId(userId, fundId);
        List<UnitsDTO> units = getFundUnits(userId, fundId);
        UserFundDetailsDTO userFundDetails = new UserFundDetailsDTO();
        userFundDetails.setLatestNav(latestNav.getFirst());
        userFundDetails.setLatestNavDate(latestNav.getSecond());
        userFundDetails.setUserFundDTO(userFund);
        userFundDetails.setSummary(summary);
        userFundDetails.setExtraSummary(extraSummary);
        userFundDetails.setUnits(units);
        userFundDetails.setRegisteredSIPs(registeredSIPs);
        return Optional.of(userFundDetails);
    }


    public List<HistoricDataDTO> getPerformanceChart(String userId, Integer fundId) {
        List<Transaction> transactions = transactionService.getTransactionsByUserIdAndFundIdOrderByDateAsc(userId, fundId);
        if (transactions.isEmpty()) {
            return new ArrayList<>();
        }

        List<MutualFundNavDTO> navList = mfapiService.getNavHistory(fundId);
        String benchmarkEnum = getBenchmarkEnumForUserFund(userId, fundId);
        Integer benchmarkSchemeCode = mfapiService.getBenchmarkSchemeCode(benchmarkEnum);
        List<MutualFundNavDTO> benchmarkNavHistory = mfapiService.getBenchmarkNavHistory(benchmarkEnum);
        List<MutualFundNavDTO> nifty50NavHistory = mfapiService.getNifty50NavHistory();
        List<MutualFundNavDTO> nifty100NavHistory = mfapiService.getNifty100NavHistory();

        List<HistoricDataDTO> historicDataList = new ArrayList<>();

        double totalUnits = 0.0;
        double totalBenchmarkUnits = 0.0;
        double totalNifty50Units = 0.0;
        double totalNifty100Units = 0.0;
        double totalProfit;
        double totalInvested = 0.0;
        double totalInvestmentSold = 0.0;

        // Starting from the month of the first transaction
        long firstMonth = getStartOfMonthEpochIST(transactions.get(0).getDate());
        long currentEpoch = firstMonth;
        long nowEpoch = getStartOfMonthEpochIST(System.currentTimeMillis() / 1000);

        int txIndex = 0;
        Double nav;
        while (currentEpoch <= nowEpoch) {
            // Apply transactions in this month
            while (txIndex < transactions.size() && getStartOfMonthEpochIST(transactions.get(txIndex).getDate()) == currentEpoch) {

                Transaction tx = transactions.get(txIndex);
                if ("BUY".equalsIgnoreCase(tx.getTransactionType())) {
                    totalUnits += tx.getUnits();
                    totalInvested += tx.getAmount();
                    if (benchmarkEnum != null) {
                        nav = mfapiService.getNAVFromNAVList(benchmarkNavHistory, tx.getDate(), benchmarkSchemeCode);
                        totalBenchmarkUnits += (tx.getAmount() / nav);
                    }
                    nav = mfapiService.getNAVFromNAVList(nifty50NavHistory, tx.getDate(), Nifty50SchemeCode);
                    totalNifty50Units += (tx.getAmount() / nav);
                    nav = mfapiService.getNAVFromNAVList(nifty100NavHistory, tx.getDate(), Nifty100SchemeCode);
                    totalNifty100Units += (tx.getAmount() / nav);
                } else {
                    totalUnits -= tx.getUnits();
                    totalInvested -= (tx.getAmount() - tx.getBookedProfit());
                    if (benchmarkEnum != null) {
                        nav = mfapiService.getNAVFromNAVList(benchmarkNavHistory, tx.getDate(), benchmarkSchemeCode);
                        totalBenchmarkUnits -= (tx.getAmount() / nav);
                    }
                    nav = mfapiService.getNAVFromNAVList(nifty50NavHistory, tx.getDate(), Nifty50SchemeCode);
                    totalNifty50Units -= (tx.getAmount() / nav);
                    nav = mfapiService.getNAVFromNAVList(nifty100NavHistory, tx.getDate(), Nifty100SchemeCode);
                    totalNifty100Units -= (tx.getAmount() / nav);
                    totalInvestmentSold += (tx.getAmount() - tx.getBookedProfit());
                }
                txIndex++;
            }

            // Compute NAV for end of month
            long endOfMonth = getEndOfMonthEpochIST(currentEpoch);
            nav = mfapiService.getNAVFromNAVList(navList, endOfMonth, fundId);
            if (nav == null) nav = 0.0;

            double totalValue = nav * totalUnits;
            totalProfit = totalValue - totalInvested;

            HistoricDataDTO data = new HistoricDataDTO();
            data.setMonth(getMonthStringFromEpochIST(currentEpoch));
            data.setTotalValue(totalValue);
            data.setTotalProfit(totalProfit);
            data.setTotalInvested(totalInvested);
            if (benchmarkEnum != null) {
                data.setTotalValueBenchmark(totalBenchmarkUnits * mfapiService.getNAVFromNAVList(benchmarkNavHistory, endOfMonth, benchmarkSchemeCode));
            } else {
                data.setTotalValueBenchmark(data.getTotalValue());
            }
            data.setTotalValueNifty50(totalNifty50Units * mfapiService.getNAVFromNAVList(nifty50NavHistory, endOfMonth, Nifty50SchemeCode));
            data.setTotalValueNifty100(totalNifty100Units * mfapiService.getNAVFromNAVList(nifty100NavHistory, endOfMonth, Nifty100SchemeCode));

            if (historicDataList.isEmpty()) {
                data.setThisMonthProfit(totalProfit);
                data.setThisMonthInvested(totalInvested);
                data.setGrowthPercent(totalInvested == 0 ? 0.0 : (totalProfit / totalInvested) * 100.0);
            } else {
                HistoricDataDTO prev = historicDataList.getLast();
                data.setThisMonthProfit(totalProfit - prev.getTotalProfit());
                data.setThisMonthInvested(totalInvested - prev.getTotalInvested() + totalInvestmentSold);
                data.setGrowthPercent(prev.getTotalInvested() == 0 ? 0.0 : (data.getThisMonthProfit() / prev.getTotalInvested()) * 100.0);
            }
            data.setAlphaPercent(((data.getTotalValue() - data.getTotalValueBenchmark()) * 100) / data.getTotalValueBenchmark());
            historicDataList.add(data);
            totalInvestmentSold = 0.0;

            // Move to next month
            currentEpoch = getNextMonthEpochIST(currentEpoch);
        }
        return historicDataList;
    }

    @Async
    public CompletableFuture<List<HistoricDataDTO>> getHistoricDataAsync(String userId, Integer fundId) {
        List<HistoricDataDTO> data = getPerformanceChart(userId, fundId);
        return CompletableFuture.completedFuture(data);
    }

    public Optional<HistoricChartDTO> getHistoricChart(Integer fundId) {
        HistoricChartDTO historicChartDTO = new HistoricChartDTO();
        List<MutualFundNavDTO> navHistory = mfapiService.getNavHistory(fundId);

        // Convert to NavDateDTO and sort by date in descending order (newest first)
        List<NavDateDTO> navs = navHistory.stream().map(NavDateDTO::new).sorted((a, b) -> {
            // Parse dates in DD-MM-YYYY format
            String[] dateA = a.getDate().split("-");
            String[] dateB = b.getDate().split("-");
            int comparison = 0;
            // Compare years
            comparison = Integer.compare(Integer.parseInt(dateB[2]), Integer.parseInt(dateA[2]));
            if (comparison != 0) return comparison;
            // Compare months
            comparison = Integer.compare(Integer.parseInt(dateB[1]), Integer.parseInt(dateA[1]));
            if (comparison != 0) return comparison;
            // Compare days
            return Integer.compare(Integer.parseInt(dateB[0]), Integer.parseInt(dateA[0]));
        }).toList();
        historicChartDTO.setHistoricNAVs(navs);
        return Optional.of(historicChartDTO);
    }


    @Override
    public Boolean registerNewSIP(SIPDTO sipdto) {
        try {
            log.info("Creating SIP for user: {} and fund: {}", sipdto.getUserId(), sipdto.getFundId());

            // Check if UserFund exists, if not create it
            String userFundCheck = existsUserFundByUserIdAndFundId(sipdto.getUserId(), sipdto.getFundId());

            if (userFundCheck.equals("false")) {
                log.info("UserFund not found for user: {} and fund: {}, creating new UserFund", sipdto.getUserId(), sipdto.getFundId());

                // Create UserFundDTO
                UserFundDTO userFundDTO = new UserFundDTO();
                userFundDTO.setUserId(sipdto.getUserId());
                userFundDTO.setFundId(sipdto.getFundId());
                userFundDTO.setFundName(sipdto.getFundName());
                userFundDTO.setIsEmergency(false); // Default to false
                userFundDTO.setTag(null); // Default to null
                userFundDTO.setBenchmark(null); // Default to null

                // Create the UserFund
                String userFundResult = createUserFund(userFundDTO);
                if (userFundResult.startsWith("Error:")) {
                    throw new ApiException("Failed to create UserFund: " + userFundResult, HttpStatus.BAD_REQUEST);
                }
                log.info("UserFund created successfully: {}", userFundResult);
            } else if (userFundCheck.startsWith("Error:")) {
                throw new ApiException("Error checking UserFund existence " + userFundCheck, HttpStatus.BAD_REQUEST);
            } else {
                log.info("UserFund already exists for user: {} and fund: {}", sipdto.getUserId(), sipdto.getFundId());
            }

            // Register New SIP.
            String result = sipService.addSIP(sipdto);
            log.info("Success: SIP created successfully with ID: " + result);

            return true;
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating SIP for user: {} and fund: {}", sipdto.getUserId(), sipdto.getFundId(), e);
            throw new ApiException("Error creating SIP : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String addTransaction(TransactionDTO transactionDTO) {
        try {
            log.info("Creating transaction for user: {} and fund: {}", transactionDTO.getUserId(), transactionDTO.getFundId());

            // Check if UserFund exists, if not create it
            String userFundCheck = existsUserFundByUserIdAndFundId(transactionDTO.getUserId(), transactionDTO.getFundId());

            if (userFundCheck.equals("false")) {
                log.info("UserFund not found for user: {} and fund: {}, creating new UserFund", transactionDTO.getUserId(), transactionDTO.getFundId());

                // Create UserFundDTO
                UserFundDTO userFundDTO = new UserFundDTO();
                userFundDTO.setUserId(transactionDTO.getUserId());
                userFundDTO.setFundId(transactionDTO.getFundId());
                userFundDTO.setFundName(transactionDTO.getFundName());
                userFundDTO.setIsEmergency(false); // Default to false
                userFundDTO.setTag(null); // Default to null

                // Create the UserFund
                String userFundResult = createUserFund(userFundDTO);
                if (userFundResult.startsWith("Error:")) {
                    log.error("Failed to create UserFund: {}", userFundResult);
                    return "Error: Failed to create UserFund - " + userFundResult;
                }
                log.info("UserFund created successfully: {}", userFundResult);
            } else if (userFundCheck.startsWith("Error:")) {
                log.error("Error checking UserFund existence: {}", userFundCheck);
                return "Error: Failed to check UserFund existence - " + userFundCheck;
            } else {
                log.info("UserFund already exists for user: {} and fund: {}", transactionDTO.getUserId(), transactionDTO.getFundId());
            }
            if (transactionDTO.getAmount() == null && transactionDTO.getUnits() == null) {
                return "Error. Invalid Transaction.Both Units and Amount not specified.";
            }
            if (transactionDTO.getAmount() != null && transactionDTO.getUnits() != null) {
                return "Error. Invalid Transaction.Both Units and Amount are specified.";
            }

            // Create the transaction
            String result = transactionService.addTransaction(transactionDTO);
            refreshUserFundByUserIdAndFundId(transactionDTO.getUserId(), transactionDTO.getFundId());
            return "Success: Transaction created successfully with ID: " + result;
        } catch (Exception e) {
            log.error("Error creating transaction for user: {} and fund: {}", transactionDTO.getUserId(), transactionDTO.getFundId(), e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String addBulkTransactions(List<TransactionDTO> transactions) {
        try {
            log.info("Creating {} transactions in bulk", transactions.size());

            int successCount = 0;
            int failureCount = 0;
            List<String> errors = new ArrayList<>();

            for (TransactionDTO transactionDTO : transactions) {
                try {
                    // Create the transaction
                    addTransaction(transactionDTO);
                    successCount++;

                } catch (Exception e) {
                    log.error("Error creating transaction for user: {} and fund: {}", transactionDTO.getUserId(), transactionDTO.getFundId(), e);
                    errors.add("Transaction creation failed for user: " + transactionDTO.getUserId() + ", fund: " + transactionDTO.getFundId() + " - " + e.getMessage());
                    failureCount++;
                }
            }

            // Prepare response
            StringBuilder response = new StringBuilder();
            response.append("Success: Bulk transaction operation completed. ");
            response.append("Successfully created: ").append(successCount).append(" transactions. ");

            if (failureCount > 0) {
                response.append("Failed: ").append(failureCount).append(" transactions. ");
                if (!errors.isEmpty()) {
                    response.append("Errors: ").append(String.join("; ", errors));
                }
            }

            log.info("Bulk transaction operation completed. Success: {}, Failures: {}", successCount, failureCount);
            return response.toString();

        } catch (Exception e) {
            log.error("Error in bulk transaction operation", e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteTransaction(String transactionId) {
        Pair<String, Transaction> result = transactionService.deleteTransaction(transactionId);
        refreshUserFundByUserIdAndFundId(result.getSecond().getUserId(), result.getSecond().getFundId());
        return result.getFirst();
    }


    private UserFundDTO convertToDTO(UserFund userFund) {
        return new UserFundDTO(userFund.getUserId(), userFund.getFundId(), userFund.getFundName(), userFund.getIsEmergency(), userFund.getTag(), userFund.getBenchmark(), userFund.getUnits(), userFund.getInvestmentAmount());
    }

    private UserFund convertToEntity(UserFundDTO userFundDTO) {
        UserFund userFund = new UserFund();
        userFund.setUserId(userFundDTO.getUserId());
        userFund.setFundId(userFundDTO.getFundId());
        userFund.setFundName(userFundDTO.getFundName());
        userFund.setIsEmergency(userFundDTO.getIsEmergency());
        userFund.setTag(userFundDTO.getTag());
        userFund.setBenchmark(userFundDTO.getBenchmark());
        return userFund;
    }
}