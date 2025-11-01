package com.stonks.service.impl;

import com.stonks.dto.MFAPIDTOs.MutualFundDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundDetailDTO;
import com.stonks.dto.MFAPIDTOs.MutualFundNavDTO;
import com.stonks.service.MutualFundAPIService;
import com.stonks.service.MutualFundDataService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.stonks.util.TimeUtils.convertEpochToISTDateString;
import static com.stonks.util.TimeUtils.convertISTDateStringToEpoch;

@Service
@RequiredArgsConstructor
@Slf4j
public class MFAPIServiceImpl implements MutualFundDataService {

    private final MutualFundAPIService mutualFundAPIService;
    private static final Map<String, Integer> BenchmarkMapping = Map.of("Nifty 100", 149868, "Nifty 500", 152731, "Nifty 150 Midcap", 150673, "Nifty 250 Smallcap", 150677, "Nifty Dividend Opportunities", 128639, "NASDAQ 100", 149219);


    @Override
    public List<MutualFundDTO> getAllMutualFunds() {
        return mutualFundAPIService.getAllMutualFunds();
    }

    @Override
    public Optional<MutualFundDTO> getMutualFundBySchemeCode(Integer schemeCode) {

        List<MutualFundDTO> allFunds = mutualFundAPIService.getAllMutualFunds();

        return allFunds.stream().filter(fund -> fund.getSchemeCode().equals(schemeCode)).findFirst();
    }

    @Override
    public Double getLatestNav(Integer schemeCode) {
        Double nav = mutualFundAPIService.getLatestNAV(schemeCode);
        if (nav != null) {
            return nav;
        }

        Optional<MutualFundDetailDTO> fundDetails = mutualFundAPIService.getMutualFundDetails(schemeCode);

        if (fundDetails.isPresent() && fundDetails.get().getData() != null && !fundDetails.get().getData().isEmpty()) {

            // Get the first (latest) NAV entry
            String latestNav = fundDetails.get().getData().get(0).getNav();
            return Double.valueOf(latestNav);
        }

        log.warn("No NAV data found for scheme code: {}", schemeCode);
        return null;
    }

    @Override
    public Double getYesterdaysNav(Integer schemeCode) {

        Optional<MutualFundDetailDTO> fundDetails = mutualFundAPIService.getMutualFundDetails(schemeCode);

        if (fundDetails.isPresent() && fundDetails.get().getData() != null && fundDetails.get().getData().size() >= 2) {

            // Get the first (latest) NAV entry
            String latestNav = fundDetails.get().getData().get(1).getNav();
            return Double.valueOf(latestNav);
        }

        log.warn("No NAV data found for scheme code: {}", schemeCode);
        return null;
    }

    @Override
    public Pair<Double, String> getLatestNavAndNavDate(Integer schemeCode) {
        Optional<MutualFundDetailDTO> fundDetails = mutualFundAPIService.getMutualFundDetails(schemeCode);

        if (fundDetails.isPresent() && fundDetails.get().getData() != null && !fundDetails.get().getData().isEmpty()) {

            // Get the first (latest) NAV entry
            MutualFundNavDTO latestNav = fundDetails.get().getData().getFirst();
            return Pair.of(Double.valueOf(latestNav.getNav()), latestNav.getDate());
        }

        log.warn("No NAV data found for scheme code: {}", schemeCode);
        return null;
    }

    @Override
    public List<MutualFundNavDTO> getNavHistory(Integer schemeCode) {

        Optional<MutualFundDetailDTO> fundDetails = mutualFundAPIService.getMutualFundDetails(schemeCode);

        if (fundDetails.isPresent() && fundDetails.get().getData() != null) {
            log.info("Retrieved {} NAV data points for scheme code: {}", fundDetails.get().getData().size(), schemeCode);
            return fundDetails.get().getData();
        }

        log.warn("No NAV history found for scheme code: {}", schemeCode);
        return List.of();
    }

    @Override
    public Pair<Double, Boolean> getNavForDate(Integer schemeCode, Long epochSeconds) {
        Optional<MutualFundDetailDTO> fundDetails = mutualFundAPIService.getMutualFundDetails(schemeCode);

        if (fundDetails.isEmpty() || fundDetails.get().getData() == null || fundDetails.get().getData().isEmpty()) {
            log.warn("No NAV data found for scheme code: {}", schemeCode);
            return null;
        }

        List<MutualFundNavDTO> navData = fundDetails.get().getData();

        // Convert epoch seconds to IST date string
        String targetDateString = convertEpochToISTDateString(epochSeconds);
        log.debug("Target date string (IST): {}", targetDateString);

        // Binary search for the target date
        int index = binarySearchForDate(navData, targetDateString);

        if (index < 0) {
            log.warn("No NAV data found for scheme code: {}", schemeCode);
            return Pair.of(getLatestNav(schemeCode), false);
        }

        return Pair.of(Double.valueOf(navData.get(index).getNav()), true);
    }

    @Override
    public Double getNAVFromNAVList(List<MutualFundNavDTO> navData, Long epochSeconds, Integer schemeCode) {
        // Convert epoch seconds to IST date string
        String targetDateString = convertEpochToISTDateString(epochSeconds);
        log.debug("Target date string (IST): {}", targetDateString);

        // Binary search for the target date
        int index = binarySearchForDate(navData, targetDateString);
        if (index < 0) {
            return getLatestNav(schemeCode);
        }

        return Double.valueOf(navData.get(index).getNav());
    }

    @Override
    public List<MutualFundNavDTO> getBenchmarkNavHistory(String benchmark) {
        if (benchmark == null || benchmark.isEmpty()) {
            return null;
        }
        Integer schemeCode = BenchmarkMapping.get(benchmark);
        if (schemeCode == null) {
            return null;
        }
        return getNavHistory(schemeCode);
    }

    @Override
    public Integer getBenchmarkSchemeCode(String benchmark) {
        if (benchmark == null || benchmark.isEmpty()) {
            return null;
        }
        return BenchmarkMapping.get(benchmark);
    }


    @Override
    public List<MutualFundNavDTO> getNifty50NavHistory() {
        return getNavHistory(119063);
    }


    @Override
    public List<MutualFundNavDTO> getNifty100NavHistory() {
        return getNavHistory(149868);
    }


    private int binarySearchForDate(List<MutualFundNavDTO> navData, String targetDate) {
        int left = 0;
        int right = navData.size() - 1;
        Long targetEpochSeconds = convertISTDateStringToEpoch(targetDate);

        int ans = -1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            String midDate = navData.get(mid).getDate();
            Long midEpochSeconds = convertISTDateStringToEpoch(midDate);
            if (midEpochSeconds >= targetEpochSeconds) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans;
    }
}
