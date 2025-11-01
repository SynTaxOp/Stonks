package com.stonks.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "userFund")
@CompoundIndex(name = "user_fund_idx", def = "{'userId': 1, 'fundId': 1}", unique = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFund {

    @Id
    private String id;
    private String userId;
    private Integer fundId;
    private String fundName;
    private Boolean isEmergency;
    private String tag;
    private String benchmark;
    private Double units;
    private Double investmentAmount;
}
