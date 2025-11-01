package com.stonks.util;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.stats.CacheStats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@Slf4j
public class CacheUtils {

    private final CacheManager cacheManager;

    public CacheUtils(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    /**
     * Get cache statistics for monitoring
     */
    public void logCacheStats() {
        log.info("=== Cache Statistics ===");
        
        String[] cacheNames = {"allMutualFunds", "mutualFundDetails", "searchResults", 
                              "mutualFundByCode", "latestNav", "navHistory"};
        
        for (String cacheName : cacheNames) {
            org.springframework.cache.Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                Object nativeCache = cache.getNativeCache();
                if (nativeCache instanceof Cache) {
                    @SuppressWarnings("unchecked")
                    Cache<Object, Object> caffeineCache = (Cache<Object, Object>) nativeCache;
                    CacheStats stats = caffeineCache.stats();
                    
                    log.info("Cache: {} - Size: {}, Hit Rate: {:.2f}%, Miss Rate: {:.2f}%, " +
                            "Hit Count: {}, Miss Count: {}, Eviction Count: {}",
                            cacheName,
                            caffeineCache.estimatedSize(),
                            stats.hitRate() * 100,
                            stats.missRate() * 100,
                            stats.hitCount(),
                            stats.missCount(),
                            stats.evictionCount());
                }
            }
        }
        log.info("=======================");
    }

    /**
     * Clear all caches
     */
    public void clearAllCaches() {
        log.info("Clearing all caches...");
        cacheManager.getCacheNames().forEach(cacheName -> {
            Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
            log.info("Cleared cache: {}", cacheName);
        });
    }

    /**
     * Clear specific cache
     */
    public void clearCache(String cacheName) {
        org.springframework.cache.Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            log.info("Cleared cache: {}", cacheName);
        } else {
            log.warn("Cache not found: {}", cacheName);
        }
    }
}
