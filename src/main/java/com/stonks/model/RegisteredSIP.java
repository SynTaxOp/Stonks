package com.stonks.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "registeredSIP")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredSIP {

    @Id
    private String id;
    private String fundName;
    private Integer fundId;
    private String userId;
    private Double amount;
}
