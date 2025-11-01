package com.stonks.repository;

import com.stonks.model.UserFund;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserFundRepository extends MongoRepository<UserFund, String> {
    List<UserFund> findByUserId(String userId);
    List<UserFund> findByUserIdAndTag(String userId, String tag);
    List<UserFund> findByUserIdAndFundId(String userId, Integer fundId);
}
