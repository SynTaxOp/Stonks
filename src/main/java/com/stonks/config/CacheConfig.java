package com.stonks.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Arrays;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(caffeineConfig());
        // Explicitly set cache names - only the two required caches
        cacheManager.setCacheNames(Arrays.asList(
                "allMutualFunds",
                "mutualFundDetails",
                "latestNav"
        ));
        return cacheManager;
    }

    @Bean
    public Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .maximumSize(10000) // Maximum number of entries in cache
                .expireAfterWrite(Duration.ofHours(24)) // TTL of 24 hours
                .recordStats(); // Enable cache statistics
    }
}
