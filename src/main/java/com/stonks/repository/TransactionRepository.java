package com.stonks.repository;

import com.stonks.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserIdAndFundIdOrderByDateDescIsRedeemedAsc(String userId, Integer fundId);
    List<Transaction> findByUserIdAndFundIdOrderByDateAsc(String userId, Integer fundId);
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByTransactionType(String transactionType);
}
