package com.stonks.controller;

import java.util.List;

import com.stonks.dto.BaseResponse;
import com.stonks.dto.TransactionDTO;
import com.stonks.service.UserFundService;
import com.stonks.util.Response;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final UserFundService userFundService;

    @PostMapping
    public ResponseEntity<BaseResponse<?>> addTransaction(@Valid @RequestBody TransactionDTO transaction) {
        String result = userFundService.addTransaction(transaction);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<BaseResponse<?>> addBulkTransactions(@Valid @RequestBody List<TransactionDTO> transactions) {
        String result = userFundService.addBulkTransactions(transactions);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

    @DeleteMapping
    public ResponseEntity<BaseResponse<?>> deleteTransaction(@RequestParam(value = "transactionId") String transactionId) {
        String result = userFundService.deleteTransaction(transactionId);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }
}