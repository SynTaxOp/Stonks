package com.stonks.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class XirrUtils {

    private static final double EPSILON = 1e-7;  // accuracy threshold
    private static final int MAX_ITER = 1000;    // max Newton-Raphson iterations

    /**
     * Calculates XIRR (annualized IRR) given cash flows and corresponding dates in epoch seconds.
     *
     * @param cashFlows list of cash flows (negative for investments, positive for returns)
     * @param epochSeconds list of corresponding dates in epoch seconds (beginning of the day)
     * @return XIRR as a decimal (e.g., 0.12 = 12%)
     */
    public static double calculateXIRR(List<Double> cashFlows, List<Long> epochSeconds) {
        if (cashFlows == null || epochSeconds == null || cashFlows.size() != epochSeconds.size()) {
            throw new IllegalArgumentException("Cashflows and epochSeconds must be non-null and of same size");
        }

        // Convert epoch seconds to LocalDate list (in system's default zone or UTC)
        List<LocalDate> dates = epochSeconds.stream()
                .map(epoch -> Instant.ofEpochSecond(epoch).atZone(ZoneId.of("Asia/Kolkata")).toLocalDate())
                .toList();

        // Initial guess for rate (10%)
        double rate = 0.10;

        for (int i = 0; i < MAX_ITER; i++) {
            double fValue = f(rate, cashFlows, dates);
            double fDerivative = fDerivative(rate, cashFlows, dates);

            if (Math.abs(fDerivative) < EPSILON) {
                break;  // Avoid division by zero
            }

            double newRate = rate - fValue / fDerivative;

            if (Math.abs(newRate - rate) <= EPSILON) {
                return newRate;
            }

            rate = newRate;
        }

        return rate;
    }

    private static double f(double rate, List<Double> cashFlows, List<LocalDate> dates) {
        double result = 0.0;
        LocalDate baseDate = dates.get(0);
        for (int i = 0; i < cashFlows.size(); i++) {
            long days = ChronoUnit.DAYS.between(baseDate, dates.get(i));
            result += cashFlows.get(i) / Math.pow(1.0 + rate, days / 365.0);
        }
        return result;
    }

    private static double fDerivative(double rate, List<Double> cashFlows, List<LocalDate> dates) {
        double result = 0.0;
        LocalDate baseDate = dates.get(0);
        for (int i = 0; i < cashFlows.size(); i++) {
            long days = ChronoUnit.DAYS.between(baseDate, dates.get(i));
            double fraction = days / 365.0;
            result += -cashFlows.get(i) * fraction / Math.pow(1.0 + rate, fraction + 1.0);
        }
        return result;
    }
}
