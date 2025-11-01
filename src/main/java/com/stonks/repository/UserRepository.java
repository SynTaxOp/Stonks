package com.stonks.repository;

import java.util.Optional;

import com.stonks.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByLoginId(String loginId);
}

