package com.stonks.service.impl;

import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDetailDTO;
import com.stonks.service.MutualFundAPIService;
import com.stonks.util.ExternalApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class MutualFundAPIServiceImpl implements MutualFundAPIService {

    private final ExternalApiClient externalApiClient;
    private static final String MFAPI_BASE_URL = "https://api.mfapi.in";
    private static final String ALL_FUNDS_ENDPOINT = "/mf";
    private static final String FUND_DETAILS_ENDPOINT = "/mf/";
    private static final String LATEST_NAV_ENDPOINT = "/latest";

    @Override
    @Cacheable(value = "allMutualFunds", key = "'all'")
    public List<MutualFundDTO> getAllMutualFunds() {
        log.info("Fetching all mutual funds from MFAPI (cache miss)");

        Optional<MutualFundDTO[]> response = externalApiClient.get(MFAPI_BASE_URL + ALL_FUNDS_ENDPOINT, null, MutualFundDTO[].class, null);

        if (response.isPresent()) {
            log.info("Successfully fetched {} mutual funds", response.get().length);
            return List.of(response.get());
        } else {
            log.warn("Failed to fetch mutual funds from MFAPI");
            return List.of();
        }
    }

    @Override
    @Cacheable(value = "mutualFundDetails", key = "#schemeCode")
    public Optional<MutualFundDetailDTO> getMutualFundDetails(Integer schemeCode) {
        log.info("Fetching mutual fund details for scheme code: {} (cache miss)", schemeCode);

        Optional<MutualFundDetailDTO> response = externalApiClient.get(MFAPI_BASE_URL + FUND_DETAILS_ENDPOINT + schemeCode, null, MutualFundDetailDTO.class, null);

        if (response.isPresent()) {
            log.info("Successfully fetched details for scheme code: {}", schemeCode);
        } else {
            log.warn("Failed to fetch details for scheme code: {}", schemeCode);
        }

        return response;
    }

    @Override
    @Cacheable(value = "latestNav", key = "#schemeCode")
    public Double getLatestNAV(Integer schemeCode) {
        log.info("Fetching latest NAV for scheme code: {} (cache miss)", schemeCode);


        Optional<MutualFundDetailDTO> response = externalApiClient.get(MFAPI_BASE_URL + FUND_DETAILS_ENDPOINT + schemeCode + LATEST_NAV_ENDPOINT, null, MutualFundDetailDTO.class, null);
        if (response.isPresent()) {
            log.info("Successfully fetched latest NAV for scheme code: {}", schemeCode);
        } else {
            log.warn("Failed to fetch latest NAV for scheme code: {}", schemeCode);
            return null;
        }
        if (response.get().getData().isEmpty()) {
            return null;
        }
        return Double.valueOf(response.get().getData().getFirst().getNav());
    }
}
