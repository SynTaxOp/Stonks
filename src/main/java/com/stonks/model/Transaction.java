package com.stonks.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    private String id;
    private String fundName;
    private Integer fundId;
    private Double amount;
    private Long date;
    private String userId;
    private String transactionType;
    private Boolean isRedeemed;
    private Long sellDate;
    private Double units;
    private Double price;
    private Double bookedProfit;
    private Boolean isUpdated;
}
