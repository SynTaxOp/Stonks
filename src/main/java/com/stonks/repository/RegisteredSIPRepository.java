package com.stonks.repository;

import com.stonks.model.RegisteredSIP;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RegisteredSIPRepository extends MongoRepository<RegisteredSIP, String> {
    List<RegisteredSIP> findByUserIdAndFundId(String userId, Integer fundId);
    List<RegisteredSIP> findByUserId(String userId);
}
