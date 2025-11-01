package com.stonks.service;

import com.stonks.dto.TransactionDTO;
import com.stonks.model.Transaction;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.Optional;

public interface TransactionService {
    List<TransactionDTO> getTransactionsByUserId(String userId);

    List<TransactionDTO> getTransactionsByUserIdAndFundId(String userId, Integer fundId);

    List<Transaction> getTransactionsByUserIdAndFundIdOrderByDateAsc(String userId, Integer fundId);

    String addTransaction(TransactionDTO transaction);

    String addBulkTransactions(List<TransactionDTO> transactions);

    Pair<Double, Double> getTotalUnitsAndInvestedAmount(String userId, Integer fundId);

    Double calculateXIRR(List<TransactionDTO> transactions, Double currentValue);

    String updateTransaction(Transaction transaction);

    Pair<String, Transaction> deleteTransaction(String id);

    String deleteTransactionsByUserId(String userId);

    String deleteTransactionsByUserIdAndFundId(String userId, Integer fundId);
}


