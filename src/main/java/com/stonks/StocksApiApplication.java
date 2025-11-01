package com.stonks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class StocksApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(StocksApiApplication.class, args);
	}

}
