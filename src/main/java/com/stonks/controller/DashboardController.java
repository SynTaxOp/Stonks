package com.stonks.controller;

import java.util.List;
import java.util.Optional;

import com.stonks.dto.BaseResponse;
import com.stonks.dto.HistoricDataDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.UserDashboardDTO;
import com.stonks.dto.UserDashboardExtraDTO;
import com.stonks.service.DashboardPageService;
import com.stonks.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardPageService dashboardPageService;

    @GetMapping
    public ResponseEntity<BaseResponse<?>> getUserDashboard(@RequestParam String userId) {
        Optional<UserDashboardDTO> userDashboard = dashboardPageService.getUserDashboard(userId);
        return Response.success(userDashboard.get());
    }

    @GetMapping("/extra")
    public ResponseEntity<BaseResponse<?>> getUserDashboardExtra(@RequestParam String userId) {
        Optional<UserDashboardExtraDTO> userDashboardExtra = dashboardPageService.getUserDashboardExtra(userId);
        return Response.success(userDashboardExtra);
    }

    @GetMapping("/performanceChart")
    public ResponseEntity<BaseResponse<?>> getUserPerformanceGraph(@RequestParam String userId) {
        List<HistoricDataDTO> historicData = dashboardPageService.getCombinedHistoricData(userId);
        return Response.success(historicData);
    }

    @GetMapping(value = "/searchFund")
    public ResponseEntity<BaseResponse<?>> searchFund(@RequestParam String searchText) {
        List<MutualFundDTO> fundsList = dashboardPageService.getAllFundSearchResults(searchText);
        return Response.success(fundsList);
    }

    @GetMapping(value = "/quotes")
    public ResponseEntity<BaseResponse<?>> getUserQuotes() {
        List<String> data = dashboardPageService.getQuotes();
        return Response.success(data);
    }


}