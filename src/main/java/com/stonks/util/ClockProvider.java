package com.stonks.util;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockProvider {

    @Bean
    public Clock systemClock() {
        return Clock.systemUTC();
    }
}


