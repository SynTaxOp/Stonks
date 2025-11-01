package com.stonks.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stonks.dto.FundSummaryDTO;
import com.stonks.dto.FundSummaryExtraDTO;
import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.TransactionDTO;
import com.stonks.dto.UserDashboardDTO;
import com.stonks.dto.UserDashboardExtraDTO;
import com.stonks.dto.UserFundDTO;
import com.stonks.model.User;
import com.stonks.repository.UserRepository;
import com.stonks.service.DashboardPageService;
import com.stonks.service.MutualFundDataService;
import com.stonks.service.TransactionService;
import com.stonks.service.UserFundService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.TreeMap;
import java.util.concurrent.CompletableFuture;


@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardPageServiceImpl implements DashboardPageService {
    private static final List<String> POSITIVE_MESSAGES = List.of("A strong day in the market — your portfolio gained ₹%.2f. Every win compounds your long-term growth.", "Good day for the bulls! ₹%.2f added to your wealth today — consistency is your superpower.", "The market smiled today. You earned ₹%.2f — small steps, big dreams.", "₹%.2f profit today! Another step forward on your wealth journey.", "Momentum is on your side — ₹%.2f gained and a reminder that patience pays.", "Profit of ₹%.2f today! Keep the discipline, enjoy the progress.", "₹%.2f in green — smart investing looks good on you.", "The market rewarded patience — ₹%.2f up today. Keep letting your money work.", "Bulls are charging — ₹%.2f profit today! Your strategy is paying off.", "₹%.2f gain — the market favored the brave today.", "A bullish breeze lifts your portfolio — ₹%.2f in the green zone.", "₹%.2f profit and counting — compounding quietly behind the scenes.", "Another green candle day — ₹%.2f up. Keep holding strong.", "The bulls took the lead — ₹%.2f added to your wealth.", "₹%.2f gained today. The trend is your friend — ride it with patience.", "Market momentum on your side — ₹%.2f profit. Every rise builds your future.", "Steady hands paid off — ₹%.2f profit and growing confidence.", "A good day for investors — ₹%.2f up. Long-term vision is working.", "The bulls kept running — ₹%.2f gain today. Stay invested, stay rewarded.");

    private static final List<String> NEGATIVE_MESSAGES = List.of("A red day with ₹%.2f dip, but remember — volatility builds resilience.", "₹%.2f down today, but wealth creation isn’t about today — it’s about staying the course.", "Markets cooled off — ₹%.2f loss. Every storm builds stronger investors.", "₹%.2f in red, but every correction sets up the next opportunity.", "Tough day in the market — ₹%.2f down, but consistency beats timing.", "₹%.2f loss today, but investing is a marathon, not a sprint. Stay invested.", "Even great investors have red days — ₹%.2f down, but your strategy stands tall.", "The bears took control — ₹%.2f down, but every dip plants the seeds of future gains.", "₹%.2f lost today, but patience turns dips into opportunities.", "Bearish sentiment weighed in — ₹%.2f down, but conviction builds wealth.", "₹%.2f in red ink, but remember — the market tests conviction before rewarding it.", "₹%.2f loss today. The bulls rest, but they always return stronger.", "The bears dominated the session — ₹%.2f loss, but your strategy is built for the long run.", "₹%.2f decline today, but smart investors see correction as opportunity.", "The market took a pause — ₹%.2f down, but your long-term growth story remains intact.", "A bearish pullback — ₹%.2f down today. Stay calm and keep compounding.", "₹%.2f loss today, but corrections pave the way for the next rally.", "Short-term red, long-term green — ₹%.2f down today, but the journey continues.", "₹%.2f drop today, but disciplined investors always win over time.");


    private final UserRepository userRepository;
    private final TransactionService transactionService;
    private final MutualFundDataService mutualFundDataService;
    private final UserFundService userFundService;

    @Override
    public Optional<UserDashboardDTO> getUserDashboard(String userId) {
        log.info("Getting user dashboard for user: {}", userId);

        try {
            // Get user details
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("User not found with ID: {}", userId);
                return Optional.empty();
            }

            User user = userOpt.get();

            // Get all user funds
            List<UserFundDTO> userFunds = userFundService.getUserFundsByUserId(userId);
            if (userFunds.isEmpty()) {
                log.info("No funds found for user: {}", userId);
                return createEmptyDashboard(userId, user.getName());
            }

            // Fetch all fund summaries in parallel
            List<CompletableFuture<Optional<FundSummaryDTO>>> futures = userFunds.stream().map(fund -> userFundService.getFundSummaryAsync(userId, fund.getFundId())).toList();

            // Wait for all to complete
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            // Collect results
            List<FundSummaryDTO> fundSummaries = futures.stream().map(CompletableFuture::join).filter(Optional::isPresent).map(Optional::get).toList();

            // Calculate totals
            double totalInvested = 0.0;
            double totalValue = 0.0;
            double totalEmergencyFundValue = 0.0;
            Double todayTotalProfit = 0.0;


            for (FundSummaryDTO fundSummary : fundSummaries) {
                if (Boolean.TRUE.equals(fundSummary.getIsEmergency())) {
                    totalEmergencyFundValue += fundSummary.getTotalValue();
                } else {
                    totalInvested += fundSummary.getTotalInvested();
                    totalValue += fundSummary.getTotalValue();
                    todayTotalProfit += fundSummary.getTodayProfit();
                }
            }

            double profitLoss = totalValue - totalInvested;
            double profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0.0;

            // Build dashboard
            UserDashboardDTO dashboard = new UserDashboardDTO();
            dashboard.setUserID(userId);
            dashboard.setUserName(user.getName());
            dashboard.setFundSummaries(fundSummaries);
            dashboard.setTotalInvested(totalInvested);
            dashboard.setTotalValue(totalValue);
            dashboard.setProfitLoss(profitLoss);
            dashboard.setProfitLossPercent(profitLossPercent);
            dashboard.setTotalEmergencyFundValue(totalEmergencyFundValue);
            dashboard.setTodayProfit(todayTotalProfit);
            dashboard.setTodayMessage(getDailyInvestmentMessage(todayTotalProfit));

            log.info("Successfully created dashboard for user: {} with {} funds", userId, fundSummaries.size());
            return Optional.of(dashboard);

        } catch (Exception e) {
            log.error("Error creating dashboard for user: {}", userId, e);
            return Optional.empty();
        }
    }


    @Override
    public Optional<UserDashboardExtraDTO> getUserDashboardExtra(String userId) {

        try {
            // Get user details
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("User not found with ID: {}", userId);
                return Optional.empty();
            }

            User user = userOpt.get();

            // Get all user funds
            List<UserFundDTO> userFunds = userFundService.getUserFundsByUserId(userId);
            if (userFunds.isEmpty()) {
                log.info("No funds found for user: {}", userId);
                return Optional.empty();
            }


            Double totalLongTermGains = 0.0;
            Double totalRealizedProfit = 0.0;
            Double totalCurrentYearTotalRealizedProfit = 0.0;
            Double currentValue = 0.0;
            List<TransactionDTO> transactions = new ArrayList<>();
            for (UserFundDTO userFund : userFunds) {
                Optional<FundSummaryExtraDTO> fundSummaryExtraOpt = userFundService.getFundSummaryExtra(userId, userFund.getFundId());

                if (fundSummaryExtraOpt.isPresent()) {
                    FundSummaryExtraDTO fundSummaryExtra = fundSummaryExtraOpt.get();

                    // Track emergency funds
                    if (Boolean.FALSE.equals(userFund.getIsEmergency())) {
                        totalCurrentYearTotalRealizedProfit += fundSummaryExtra.getCurrentYearTotalRealizedProfit();
                        totalLongTermGains += fundSummaryExtra.getLongTermGains();
                        totalRealizedProfit += fundSummaryExtra.getTotalRealizedProfit();
                        List<TransactionDTO> fundTransactions = transactionService.getTransactionsByUserIdAndFundId(userId, userFund.getFundId());
                        transactions.addAll(fundTransactions);
                        Double currentNAV = mutualFundDataService.getLatestNav(userFund.getFundId());
                        if (userFund.getUnits() == null) {
                            Pair<Double, Double> result = transactionService.getTotalUnitsAndInvestedAmount(userFund.getUserId(), userFund.getFundId());
                            userFund.setUnits(result.getFirst());
                            userFundService.updateUserFundByUserIdAndFundId(userFund.getUserId(), userFund.getFundId(), userFund);
                        }
                        currentValue += (userFund.getUnits() * currentNAV);

                    }
                }
            }

            Double xirr = transactionService.calculateXIRR(transactions, currentValue);


            // Build dashboard extra DTO
            UserDashboardExtraDTO dashboardExtra = new UserDashboardExtraDTO();
            dashboardExtra.setXirr(xirr);
            dashboardExtra.setLongTermGains(totalLongTermGains);
            dashboardExtra.setTotalRealizedProfit(totalRealizedProfit);
            dashboardExtra.setCurrentYearTotalRealizedProfit(totalCurrentYearTotalRealizedProfit);

            return Optional.of(dashboardExtra);

        } catch (Exception e) {
            log.error("Error creating dashboard for user: {}", userId, e);
            return Optional.empty();
        }
    }


    public List<HistoricDataDTO> getCombinedHistoricData(String userId) {

        try {
            // Get user details
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("User not found with ID: {}", userId);
                return null;
            }

            User user = userOpt.get();

            // Get all user funds
            List<UserFundDTO> userFunds = userFundService.getUserFundsByUserId(userId);
            if (userFunds.isEmpty()) {
                log.info("No funds found for user: {}", userId);
                return null;
            }

            List<CompletableFuture<List<HistoricDataDTO>>> futures = userFunds.stream().filter(f -> !f.getIsEmergency()).map(userFund -> userFundService.getHistoricDataAsync(userId, userFund.getFundId())).toList();

            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();


            List<List<HistoricDataDTO>> allFundData = futures.stream().map(CompletableFuture::join).toList();


            Map<String, HistoricDataDTO> monthlyAggregate = new TreeMap<>();

            for (List<HistoricDataDTO> fundData : allFundData) {
                for (HistoricDataDTO data : fundData) {
                    monthlyAggregate.merge(data.getMonth(), new HistoricDataDTO(data), (existing, next) -> {
                        existing.setTotalValue(existing.getTotalValue() + next.getTotalValue());
                        existing.setTotalProfit(existing.getTotalProfit() + next.getTotalProfit());
                        existing.setTotalInvested(existing.getTotalInvested() + next.getTotalInvested());
                        existing.setThisMonthProfit(existing.getThisMonthProfit() + next.getThisMonthProfit());
                        existing.setThisMonthInvested(existing.getThisMonthInvested() + next.getThisMonthInvested());
                        existing.setTotalValueBenchmark(existing.getTotalValueBenchmark() + next.getTotalValueBenchmark());
                        existing.setTotalValueNifty50(existing.getTotalValueNifty50() + next.getTotalValueNifty50());
                        existing.setTotalValueNifty100(existing.getTotalValueNifty100() + next.getTotalValueNifty100());
                        if (existing.getTotalInvested() != 0) {
                            existing.setGrowthPercent((existing.getTotalProfit() / existing.getTotalInvested()) * 100.0);
                        }
                        if (existing.getTotalValueBenchmark() != 0) {
                            existing.setAlphaPercent((((existing.getTotalValue()) / existing.getTotalValueBenchmark()) - 1) * 100.0);
                        }
                        return existing;
                    });
                }
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH);

            return monthlyAggregate.values().stream().sorted(Comparator.comparing(data -> {
                return YearMonth.parse(data.getMonth(), formatter).atDay(1);
            })).toList();
        } catch (Exception e) {
            log.error("Error creating dashboard for user: {}", userId, e);
            return new ArrayList<>();
        }
    }


    @Override
    public List<MutualFundDTO> getAllFundSearchResults(String searchText) {
        if (searchText == null || searchText.isBlank()) {
            return Collections.emptyList();
        }

        String query = searchText.toLowerCase();

        // Step 1: Get all funds
        List<MutualFundDTO> allFunds = mutualFundDataService.getAllMutualFunds();

        // Step 2: Score each fund based on similarity
        List<ScoredFund> scored = allFunds.stream().filter(fund -> fund.getSchemeName() != null).map(fund -> {
                    String name = fund.getSchemeName().toLowerCase();
                    double score = calculateRelevanceScore(name, query);
                    return new ScoredFund(fund, score);
                }).filter(sf -> sf.score > 0.2) // filter out very weak matches
                .sorted(Comparator.comparingDouble((ScoredFund sf) -> -sf.score)) // sort by descending score
                .limit(20).toList();

        List<MutualFundDTO> results = scored.stream().map(sf -> sf.fund).toList();
        return results;
    }

    /**
     * Combines substring match boost + fuzzy similarity
     */
    private double calculateRelevanceScore(String name, String query) {
        // 1. Base similarity via normalized Levenshtein distance
        double similarity = stringSimilarity(name, query);

        // 2. Boost if it directly contains the query
        if (name.contains(query)) {
            similarity += 0.3;
        }

        // 3. Clamp between 0 and 1
        return Math.min(similarity, 1.0);
    }

    /**
     * Normalized Levenshtein similarity (1 = identical, 0 = no match)
     */
    private double stringSimilarity(String s1, String s2) {
        int distance = levenshteinDistance(s1, s2);
        int maxLen = Math.max(s1.length(), s2.length());
        if (maxLen == 0) return 1.0;
        return 1.0 - ((double) distance / maxLen);
    }

    /**
     * Lightweight Levenshtein distance implementation
     */
    private int levenshteinDistance(String s1, String s2) {
        int[] costs = new int[s2.length() + 1];
        for (int j = 0; j <= s2.length(); j++) {
            costs[j] = j;
        }
        for (int i = 1; i <= s1.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= s2.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]), s1.charAt(i - 1) == s2.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[s2.length()];
    }

    /**
     * Helper class for scoring
     */
    private static class ScoredFund {
        final MutualFundDTO fund;
        final double score;

        ScoredFund(MutualFundDTO fund, double score) {
            this.fund = fund;
            this.score = score;
        }
    }


    @Override
    public List<String> getQuotes() {
        return List.of(
                // Classic Investing Quotes
                "The best investment you can make is in yourself. — Warren Buffett", "Know what you own, and know why you own it. — Peter Lynch", "Price is what you pay. Value is what you get. — Warren Buffett", "An investment in knowledge pays the best interest. — Benjamin Franklin", "The stock market is filled with individuals who know the price of everything, but the value of nothing. — Philip Fisher", "Time in the market beats timing the market. — Ken Fisher", "Invest for the long haul. Don’t get too greedy and don’t get too scared. — Shelby M.C. Davis", "The four most dangerous words in investing are: ‘This time it’s different.’ — Sir John Templeton", "Risk comes from not knowing what you’re doing. — Warren Buffett", "In investing, what is comfortable is rarely profitable. — Robert Arnott", "Compound interest is the eighth wonder of the world. — Albert Einstein", "The individual investor should act consistently as an investor and not as a speculator. — Ben Graham", "Do not save what is left after spending, but spend what is left after saving. — Warren Buffett", "Diversification is protection against ignorance. — Warren Buffett", "Behind every stock is a company. Find out what it’s doing. — Peter Lynch", "Investing should be more like watching paint dry or grass grow. — Paul Samuelson", "Wide diversification is only required when investors do not understand what they are doing. — Warren Buffett", "The intelligent investor is a realist who sells to optimists and buys from pessimists. — Ben Graham", "We don’t have to be smarter than the rest. We have to be more disciplined than the rest. — Warren Buffett", "The goal of the investor should be to purchase a business, not just a stock. — Charlie Munger",

                // Modern/Startup-Investor Quotes
                "The biggest risk is not taking one. — Mark Zuckerberg", "Investing isn’t about being right. It’s about making fewer mistakes than others. — Morgan Housel", "Patience is a competitive advantage. — Morgan Housel", "You don’t need to make extraordinary moves to get extraordinary results. — Warren Buffett", "In the short run, the market is a voting machine; in the long run, it’s a weighing machine. — Benjamin Graham", "Do the hard work now so you can play later. — Naval Ravikant", "Fortunes are built when you see what others don’t. — Chamath Palihapitiya", "The goal isn’t more money. The goal is financial freedom. — Tony Robbins", "Investing is simple, but not easy. — Warren Buffett", "You get rewarded for the discipline others avoid. — Ray Dalio", "Don’t bet on trends; bet on inevitabilities. — Jeff Bezos", "Every great investment starts with thinking differently. — Howard Marks", "Focus on being directionally right, not precisely wrong. — Jeff Bezos", "Be fearful when others are greedy, and greedy when others are fearful. — Warren Buffett", "If you can’t sleep because of your investments, you’re overexposed. — George Soros", "Stay curious longer than everyone else. — Naval Ravikant");
    }


    private String getDailyInvestmentMessage(Double profit) {
        List<String> messages;
        if (profit > 0.0) { // Positive range
            messages = POSITIVE_MESSAGES;
        } else { // Negative range
            messages = NEGATIVE_MESSAGES;
        }
        Random random = new Random();
        String template = messages.get(random.nextInt(messages.size()));
        return String.format(template, Math.abs(profit));
    }


    private Optional<UserDashboardDTO> createEmptyDashboard(String userId, String userName) {
        UserDashboardDTO dashboard = new UserDashboardDTO();
        dashboard.setUserID(userId);
        dashboard.setUserName(userName);
        dashboard.setFundSummaries(new ArrayList<>());
        dashboard.setTotalInvested(0.0);
        dashboard.setTotalValue(0.0);
        dashboard.setProfitLoss(0.0);
        dashboard.setProfitLossPercent(0.0);
        dashboard.setTotalEmergencyFundValue(0.0);
        return Optional.of(dashboard);
    }


}
