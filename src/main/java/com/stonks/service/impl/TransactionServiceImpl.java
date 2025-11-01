package com.stonks.service.impl;

import com.stonks.dto.TransactionDTO;
import com.stonks.model.Transaction;
import com.stonks.repository.TransactionRepository;
import com.stonks.service.MutualFundDataService;
import com.stonks.service.TransactionService;

import com.stonks.util.XirrUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.stonks.util.TimeUtils.convertEpochToISTDateString;
import static com.stonks.util.TimeUtils.convertISTDateStringToEpoch;


@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final MutualFundDataService mfAPIService;


    @Override
    public List<TransactionDTO> getTransactionsByUserId(String userId) {
        try {
            log.debug("Getting all transactions for user: {}", userId);

            List<Transaction> transactions = transactionRepository.findByUserId(userId);
            List<TransactionDTO> transactionDTOs = transactions.stream().map(this::convertToDTO).collect(Collectors.toList());

            log.debug("Found {} transactions for user: {}", transactionDTOs.size(), userId);
            return transactionDTOs;
        } catch (Exception e) {
            log.error("Error getting transactions for user: {}", userId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<TransactionDTO> getTransactionsByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.debug("Getting transactions for user: {} and fund: {}", userId, fundId);

            List<Transaction> transactions = transactionRepository.findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(userId, fundId);
            List<TransactionDTO> transactionDTOs = transactions.stream().map(this::convertToDTO).collect(Collectors.toList());

            log.debug("Found {} transactions for user: {} and fund: {}", transactionDTOs.size(), userId, fundId);
            return transactionDTOs;
        } catch (Exception e) {
            log.error("Error getting transactions for user: {} and fund: {}", userId, fundId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Transaction> getTransactionsByUserIdAndFundIdOrderByDateAsc(String userId, Integer fundId){
        return transactionRepository.findByUserIdAndFundIdOrderByDateAsc(userId, fundId);
    }


    @Override
    public String addTransaction(TransactionDTO transactionDTO) {
        try {
            Transaction transaction = convertToEntity(transactionDTO);
            log.info("Creating transaction for user: {} and fund: {}", transactionDTO.getUserId(), transactionDTO.getFundId());
            Pair<Double, Boolean> navData = mfAPIService.getNavForDate(transaction.getFundId(), transaction.getDate());
            transaction.setPrice(navData.getFirst());
            transaction.setIsUpdated(navData.getSecond());
            if (transactionDTO.getAmount() != null) {
                transaction.setAmount(transactionDTO.getAmount());
                transaction.setUnits((transaction.getAmount() * 0.99995) / navData.getFirst());
            } else {
                transaction.setUnits(transactionDTO.getUnits());
                transaction.setAmount(transaction.getUnits() * transaction.getPrice() * 1.000186);
            }

            if (Objects.equals(transactionDTO.getTransactionType(), "BUY")) {
                transaction.setSellDate(null);
                transaction.setIsRedeemed(false);
                transaction.setBookedProfit(null);
            }
            if (Objects.equals(transactionDTO.getTransactionType(), "SELL")) {
                Pair<Double, Double> result = getTotalUnitsAndInvestedAmount(transactionDTO.getUserId(), transactionDTO.getFundId());
                Double totalRedeemableUnits = result.getFirst();
                if (transactionDTO.getUnits() > totalRedeemableUnits) {
                    throw new RuntimeException("Invalid Sell Transaction.Total Requested Units: " + transactionDTO.getUnits() + ", Total Redeemable Units: " + totalRedeemableUnits);
                }
                Double totalBookedProfit = redeemUnitsAndCalculateBookedProfit(transaction);
                transaction.setSellDate(null);
                transaction.setIsRedeemed(true);
                transaction.setBookedProfit(totalBookedProfit);
            }

            // Create the transaction
            Transaction savedTransaction = transactionRepository.save(transaction);

            log.info("Transaction created successfully with ID: {}", savedTransaction.getId());
            return savedTransaction.getId();
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
                    Transaction transaction = convertToEntity(transactionDTO);
                    Transaction savedTransaction = transactionRepository.save(transaction);
                    successCount++;
                    log.debug("Transaction created successfully with ID: {}", savedTransaction.getId());

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

    // Mark all the transaction as redeemed in this sell transaction and returns totalProfitBooked.
    private Double redeemUnitsAndCalculateBookedProfit(Transaction transaction) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndFundIdOrderByDateAsc(transaction.getUserId(), transaction.getFundId());
        Double unitsLeft = transaction.getUnits();
        Double sellingPrice = transaction.getPrice();
        Double totalBookedProfit = 0.0;
        for (Transaction pastTransaction : transactions) {
            if (unitsLeft == 0.0) {
                break;
            }
            if (Objects.equals(pastTransaction.getTransactionType(), "BUY") && !pastTransaction.getIsRedeemed()) {
                if (unitsLeft >= pastTransaction.getUnits()) {
                    pastTransaction.setIsRedeemed(true);
                    pastTransaction.setSellDate(transaction.getDate());
                    pastTransaction.setBookedProfit(pastTransaction.getUnits() * (sellingPrice - pastTransaction.getPrice()));
                    String result = updateTransaction(pastTransaction);
                    totalBookedProfit += pastTransaction.getBookedProfit();
                    unitsLeft -= pastTransaction.getUnits();
                } else {
                    // Split the units;
                    Double remainingUnits = pastTransaction.getUnits() - unitsLeft;

                    TransactionDTO remainingTransactionDTO = new TransactionDTO();
                    remainingTransactionDTO.setTransactionType("BUY");
                    remainingTransactionDTO.setUserId(pastTransaction.getUserId());
                    remainingTransactionDTO.setFundName(pastTransaction.getFundName());
                    remainingTransactionDTO.setAmount(remainingUnits * pastTransaction.getPrice());
                    remainingTransactionDTO.setFundId(pastTransaction.getFundId());
                    remainingTransactionDTO.setDate(convertEpochToISTDateString(pastTransaction.getDate()));
                    remainingTransactionDTO.setFundId(pastTransaction.getFundId());
                    remainingTransactionDTO.setUnits(remainingUnits);
                    addTransaction(remainingTransactionDTO);


                    pastTransaction.setIsRedeemed(true);
                    pastTransaction.setAmount(unitsLeft * pastTransaction.getPrice());
                    pastTransaction.setSellDate(transaction.getDate());
                    pastTransaction.setBookedProfit(unitsLeft * (sellingPrice - pastTransaction.getPrice()));
                    pastTransaction.setUnits(unitsLeft);
                    totalBookedProfit += pastTransaction.getBookedProfit();

                    String result = updateTransaction(pastTransaction);
                    unitsLeft -= pastTransaction.getUnits();
                    break;
                }

            }
        }
        return totalBookedProfit;
    }

    private void revertSellTransaction(Transaction transaction) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(transaction.getUserId(), transaction.getFundId());
        Double unitsLeft = transaction.getUnits();
        for (Transaction pastTransaction : transactions) {
            if (unitsLeft == 0.0) {
                break;
            }
            if (Objects.equals(pastTransaction.getTransactionType(), "BUY") && pastTransaction.getIsRedeemed()) {
                if (unitsLeft >= pastTransaction.getUnits()) {
                    pastTransaction.setIsRedeemed(false);
                    pastTransaction.setSellDate(null);
                    pastTransaction.setBookedProfit(null);
                    String result = updateTransaction(pastTransaction);
                    unitsLeft -= pastTransaction.getUnits();
                } else {
                    // Split the units;
                    Double remainingUnits = pastTransaction.getUnits() - unitsLeft;

                    TransactionDTO remainingTransactionDTO = new TransactionDTO();
                    remainingTransactionDTO.setTransactionType("BUY");
                    remainingTransactionDTO.setUserId(pastTransaction.getUserId());
                    remainingTransactionDTO.setFundName(pastTransaction.getFundName());
                    remainingTransactionDTO.setAmount(remainingUnits * pastTransaction.getPrice());
                    remainingTransactionDTO.setFundId(pastTransaction.getFundId());
                    remainingTransactionDTO.setDate(convertEpochToISTDateString(pastTransaction.getDate()));
                    remainingTransactionDTO.setFundId(pastTransaction.getFundId());
                    remainingTransactionDTO.setUnits(remainingUnits);
                    addTransaction(remainingTransactionDTO);


                    pastTransaction.setIsRedeemed(false);
                    pastTransaction.setAmount(unitsLeft * pastTransaction.getPrice());
                    pastTransaction.setSellDate(null);
                    pastTransaction.setBookedProfit(null);
                    pastTransaction.setUnits(unitsLeft);

                    String result = updateTransaction(pastTransaction);
                    unitsLeft -= pastTransaction.getUnits();
                    break;
                }

            }
        }
    }

    private Boolean isLatestSellTransaction(Transaction transaction) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(transaction.getUserId(), transaction.getFundId());
        for (Transaction pastTransaction : transactions) {
            if (Objects.equals(pastTransaction.getTransactionType(), transaction.getTransactionType())) {
                // Found first Sell transaction.
                return Objects.equals(pastTransaction.getId(), transaction.getId());
            }
        }
        return false;
    }

    public Pair<Double, Double> getTotalUnitsAndInvestedAmount(String userId, Integer fundId) {
        Double totalInvestmentAmount = 0.0;
        Double totalRedeemableUnits = 0.0;
        List<Transaction> transactions = transactionRepository.findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(userId, fundId);
        for (Transaction transaction : transactions) {
            if (Objects.equals(transaction.getTransactionType(), "BUY") && !transaction.getIsRedeemed()) {
                totalInvestmentAmount += transaction.getAmount();
                totalRedeemableUnits += transaction.getUnits();
            }
        }
        return Pair.of(totalRedeemableUnits, totalInvestmentAmount);
    }


    @Override
    public String updateTransaction(Transaction transaction) {
        try {
            log.info("Updating transaction with ID: {}", transaction.getId());

            return transactionRepository.findById(transaction.getId()).map(existingTransaction -> {
                existingTransaction.setFundName(transaction.getFundName());
                existingTransaction.setFundId(transaction.getFundId());
                existingTransaction.setAmount(transaction.getAmount());
                existingTransaction.setDate(transaction.getDate());
                existingTransaction.setUserId(transaction.getUserId());
                existingTransaction.setTransactionType(transaction.getTransactionType());
                existingTransaction.setUnits(transaction.getUnits());
                existingTransaction.setIsRedeemed(transaction.getIsRedeemed());
                existingTransaction.setSellDate(transaction.getSellDate());
                existingTransaction.setBookedProfit(transaction.getBookedProfit());
                existingTransaction.setIsUpdated(transaction.getIsUpdated());
                existingTransaction.setPrice(transaction.getPrice());

                Transaction updatedTransaction = transactionRepository.save(existingTransaction);
                log.info("Transaction with ID: {} updated successfully", transaction.getId());
                return "Success: Transaction updated successfully with ID: " + transaction.getId();
            }).orElseGet(() -> {
                log.warn("Transaction not found with ID: {}", transaction.getId());
                return "Error: Transaction not found with ID: " + transaction.getId();
            });
        } catch (Exception e) {
            log.error("Error updating transaction with ID: {}", transaction.getId(), e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public Pair<String, Transaction> deleteTransaction(String id) {
        try {
            log.info("Deleting transaction with ID: {}", id);

            if (transactionRepository.existsById(id)) {
                Transaction transaction = transactionRepository.findById(id).get();
                if (Objects.equals(transaction.getTransactionType(), "BUY") && transaction.getIsRedeemed()) {
                    return Pair.of("Error: Redeemed Transaction cannot be deleted because it is already redeemed", transaction);
                }
                if (Objects.equals(transaction.getTransactionType(), "SELL") && !isLatestSellTransaction(transaction)) {
                    return Pair.of("Error: Sell transaction cannot be deleted because it is not the latest sell transaction.", transaction);
                }
                if (Objects.equals(transaction.getTransactionType(), "SELL")) {
                    revertSellTransaction(transaction);
                }
                transactionRepository.deleteById(id);
                log.info("Transaction with ID: {} deleted successfully", id);
                return Pair.of("Success: Transaction deleted successfully with ID: " + id, transaction);
            } else {
                log.warn("Transaction with ID: {} not found for deletion", id);
                return Pair.of("Error: Transaction not found with ID: " + id, null);
            }
        } catch (Exception e) {
            log.error("Error deleting transaction with ID: {}", id, e);
            return Pair.of("Error: " + e.getMessage(), null);
        }
    }

    @Override
    public String deleteTransactionsByUserId(String userId) {
        try {
            log.info("Deleting all transactions for user: {}", userId);

            List<Transaction> transactionsToDelete = transactionRepository.findByUserId(userId);
            long count = transactionsToDelete.size();

            if (count > 0) {
                transactionRepository.deleteAll(transactionsToDelete);
                log.info("{} transactions deleted for user: {}", count, userId);
                return "Success: " + count + " transactions deleted for user: " + userId;
            } else {
                log.info("No transactions found for user: {}", userId);
                return "Success: No transactions found for user: " + userId;
            }
        } catch (Exception e) {
            log.error("Error deleting transactions for user: {}", userId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteTransactionsByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.info("Deleting transactions for user: {} and fund: {}", userId, fundId);

            List<Transaction> transactionsToDelete = transactionRepository.findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(userId, fundId);
            long count = transactionsToDelete.size();

            if (count > 0) {
                transactionRepository.deleteAll(transactionsToDelete);
                log.info("{} transactions deleted for user: {} and fund: {}", count, userId, fundId);
                return "Success: " + count + " transactions deleted for user: " + userId + " and fund: " + fundId;
            } else {
                log.info("No transactions found for user: {} and fund: {}", userId, fundId);
                return "Success: No transactions found for user: " + userId + " and fund: " + fundId;
            }
        } catch (Exception e) {
            log.error("Error deleting transactions for user: {} and fund: {}", userId, fundId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public Double calculateXIRR(List<TransactionDTO> transactions, Double currentValue) {
        try {
            List<Double> cashFlows = new ArrayList<>();
            List<Long> dates = new ArrayList<>();

            // Add investment transactions (negative cash flows)
            for (TransactionDTO transaction : transactions) {
                if ("BUY".equalsIgnoreCase(transaction.getTransactionType())) {
                    cashFlows.add(-transaction.getAmount()); // Negative for investment
                    dates.add(convertISTDateStringToEpoch(transaction.getDate()));
                }
                if ("SELL".equalsIgnoreCase(transaction.getTransactionType())) {
                    cashFlows.add(transaction.getAmount());
                    dates.add(convertISTDateStringToEpoch(transaction.getDate()));
                }
            }

            // Add current value as positive cash flow (today's date)
            if (currentValue > 0) {
                cashFlows.add(currentValue);
                dates.add(System.currentTimeMillis() / 1000); // Current time in epoch seconds
            }

            if (cashFlows.size() < 2) {
                return 0.0; // Need at least 2 cash flows for XIRR
            }

            return XirrUtils.calculateXIRR(cashFlows, dates) * 100; // Convert to percentage

        } catch (Exception e) {
            log.warn("Failed to calculate XIRR", e);
            return 0.0;
        }
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return new TransactionDTO(transaction.getId(), transaction.getFundName(), transaction.getFundId(), transaction.getAmount(), convertEpochToISTDateString(transaction.getDate()), transaction.getUserId(), transaction.getTransactionType(), transaction.getUnits(), transaction.getIsRedeemed(), convertEpochToISTDateString(transaction.getSellDate()), transaction.getPrice(), transaction.getBookedProfit(), transaction.getIsUpdated());
    }

    private Transaction convertToEntity(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setId(transactionDTO.getId());
        transaction.setFundName(transactionDTO.getFundName());
        transaction.setFundId(transactionDTO.getFundId());
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(convertISTDateStringToEpoch(transactionDTO.getDate()));
        transaction.setUserId(transactionDTO.getUserId());
        transaction.setTransactionType(transactionDTO.getTransactionType());
        return transaction;
    }
}