package com.stonks.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.LocalDateTime;
import java.util.Locale;


public class TimeUtils {


    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH).withZone(IST_ZONE);

    public static String convertEpochToISTDateString(Long epochSeconds) {
        if (epochSeconds == null) {
            return null;
        }
        Instant instant = Instant.ofEpochSecond(epochSeconds);
        LocalDate istDate = instant.atZone(ZoneId.of("Asia/Kolkata")).toLocalDate();
        return istDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
    }

    public static Long convertISTDateStringToEpoch(String istDateString) {
        if (istDateString == null || istDateString.isEmpty()) {
            return null;
        }

        // Define the date format for dd-MM-yyyy
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        // Parse the string into a LocalDate
        LocalDate localDate = LocalDate.parse(istDateString, formatter);

        // Assign time as start of day in IST
        ZonedDateTime istZoned = localDate.atStartOfDay(ZoneId.of("Asia/Kolkata"));

        // Convert to epoch seconds
        return istZoned.toEpochSecond();
    }

    public static Boolean isISTDateStringInCurrentFinancialYear(String istDateString) {
        if (istDateString == null || istDateString.isEmpty()) {
            return false;
        }

        // Define formatter for dd-MM-yyyy
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        // Parse the input date
        LocalDate inputDate;
        try {
            inputDate = LocalDate.parse(istDateString, formatter);
        } catch (Exception e) {
            return false; // Invalid format
        }

        // Use IST zone
        ZoneId istZone = ZoneId.of("Asia/Kolkata");
        LocalDate today = LocalDate.now(istZone);

        // Determine current financial year start and end
        int currentYear = today.getYear();
        LocalDate fyStart, fyEnd;

        if (today.getMonthValue() >= 4) {
            // Financial year starts this April and ends next March
            fyStart = LocalDate.of(currentYear, 4, 1);
            fyEnd = LocalDate.of(currentYear + 1, 3, 31);
        } else {
            // Financial year started last April
            fyStart = LocalDate.of(currentYear - 1, 4, 1);
            fyEnd = LocalDate.of(currentYear, 3, 31);
        }

        // Check if input date lies between FY start and end (inclusive)
        return !inputDate.isBefore(fyStart) && !inputDate.isAfter(fyEnd);
    }

    public static boolean isOneYearOrMoreOld(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return false; // or throw an exception
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate inputDate;

        try {
            inputDate = LocalDate.parse(dateString, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Expected format: dd-MM-yyyy", e);
        }

        LocalDate today = LocalDate.now();
        long yearsBetween = ChronoUnit.YEARS.between(inputDate, today);

        return yearsBetween >= 1;
    }


    public static long getStartOfMonthEpochIST(long inputEpochSeconds) {
        // Define IST timezone
        ZoneId istZone = ZoneId.of("Asia/Kolkata");

        // Convert epoch seconds to LocalDateTime in IST
        LocalDateTime istDateTime = Instant.ofEpochSecond(inputEpochSeconds).atZone(istZone).toLocalDateTime();

        // Move to first day of that month at 00:00
        LocalDateTime startOfMonth = istDateTime.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);

        // Convert back to epoch seconds in IST
        return startOfMonth.atZone(istZone).toEpochSecond();
    }

    public static long getEndOfMonthEpochIST(long epochSeconds) {
        LocalDate date = Instant.ofEpochSecond(epochSeconds).atZone(IST_ZONE).toLocalDate();
        LocalDate endOfMonth = date.withDayOfMonth(date.lengthOfMonth());
        return endOfMonth.atStartOfDay(IST_ZONE).toEpochSecond();
    }


    public static long getNextMonthEpochIST(long epochSeconds) {
        LocalDate date = Instant.ofEpochSecond(epochSeconds).atZone(IST_ZONE).toLocalDate();
        LocalDate nextMonth = date.plusMonths(1).withDayOfMonth(1);
        return nextMonth.atStartOfDay(IST_ZONE).toEpochSecond();
    }

    public static String getMonthStringFromEpochIST(long epochSeconds) {
        // Convert epoch to Instant and format using IST timezone
        return MONTH_FORMATTER.format(Instant.ofEpochSecond(epochSeconds));
    }


}
