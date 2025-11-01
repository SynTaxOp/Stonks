package com.stonks.service;

import com.stonks.dto.SIPDTO;

import java.util.List;

public interface SIPService {
    List<SIPDTO> getSIPsByUserId(String userId);
    List<SIPDTO> getSIPsByUserIdAndFundId(String userId, Integer fundId);
    String addSIP(SIPDTO sipDTO);
    String updateSIP(String id, SIPDTO sipDTO);
    String deleteSIP(String id);
    String deleteSIPByUserIdAndFundId(String userId, Integer fundId);
    String deleteAllSIPsByUserId(String userId);
    Double getTotalSIPAmountByUserId(String userId);
    Double getTotalSIPAmountByUserIdAndFundId(String userId, Integer fundId);
    Integer getSIPCountByUserId(String userId);
}