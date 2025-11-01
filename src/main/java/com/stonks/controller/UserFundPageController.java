package com.stonks.controller;

import java.util.List;
import java.util.Optional;

import com.stonks.dto.BaseResponse;
import com.stonks.dto.HistoricChartDTO;
import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.UserFundDTO;
import com.stonks.dto.UserFundDetailsDTO;
import com.stonks.service.UserFundService;
import com.stonks.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/userFund")
@RequiredArgsConstructor
public class UserFundPageController {

    private final UserFundService userFundService;

    @GetMapping
    public ResponseEntity<BaseResponse<?>> getUserFundDetails(@RequestParam String userId, @RequestParam Integer fundId) {
        Optional<UserFundDetailsDTO> userFundDetails = userFundService.getUserFundDetails(userId, fundId);
        return Response.success(userFundDetails);
    }

    @GetMapping("/performanceChart")
    public ResponseEntity<BaseResponse<?>> getUserFundPerformanceChart(@RequestParam String userId, @RequestParam Integer fundId) {
        List<HistoricDataDTO> data = userFundService.getPerformanceChart(userId, fundId);
        return Response.success(data);
    }

    @GetMapping("/historicChart")
    public ResponseEntity<BaseResponse<?>> getUserFundHistoricChart(@RequestParam Integer fundId) {
        Optional<HistoricChartDTO> data = userFundService.getHistoricChart(fundId);
        return Response.success(data);
    }


    @PutMapping
    public ResponseEntity<BaseResponse<?>> updateUserFund(@RequestParam String userId, @RequestParam Integer fundId, @RequestBody UserFundDTO userFundDTO) {
        String result = userFundService.updateUserFundByUserIdAndFundId(userId, fundId, userFundDTO);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

    @GetMapping("/benchmarkEnums")
    public ResponseEntity<BaseResponse<?>> getBenchmarkEnums() {
        List<String> result = userFundService.getAllBenchmarkStrings();
        return Response.success(result);
    }

    @DeleteMapping()
    public ResponseEntity<BaseResponse<?>> deleteUserFund(@RequestParam String userId, @RequestParam Integer fundId) {
        String result = userFundService.deleteUserFundByUserIdAndFundId(userId, fundId);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

}