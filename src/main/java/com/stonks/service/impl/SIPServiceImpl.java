package com.stonks.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stonks.dto.SIPDTO;
import com.stonks.model.RegisteredSIP;
import com.stonks.repository.RegisteredSIPRepository;
import com.stonks.service.SIPService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SIPServiceImpl implements SIPService {

    private final RegisteredSIPRepository registeredSIPRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public List<SIPDTO> getSIPsByUserId(String userId) {
        try {
            log.debug("Getting all SIPs for user: {}", userId);
            
            List<RegisteredSIP> sips = registeredSIPRepository.findByUserId(userId);
            List<SIPDTO> sipDTOs = sips.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            log.debug("Found {} SIPs for user: {}", sipDTOs.size(), userId);
            return sipDTOs;
        } catch (Exception e) {
            log.error("Error getting SIPs for user: {}", userId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<SIPDTO> getSIPsByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.debug("Getting SIP for user: {} and fund: {}", userId, fundId);

            List<RegisteredSIP> sips = registeredSIPRepository.findByUserIdAndFundId(userId, fundId);
            return sips.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting SIP for user: {} and fund: {}", userId, fundId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public String addSIP(SIPDTO sipDTO) {
        try {
            log.info("Creating SIP for user: {} and fund: {}", sipDTO.getUserId(), sipDTO.getFundId());

            RegisteredSIP sip = convertToEntity(sipDTO);
            RegisteredSIP savedSIP = registeredSIPRepository.save(sip);
            
            log.info("SIP created successfully with ID: {}", savedSIP.getId());
            return savedSIP.getId();
        } catch (Exception e) {
            log.error("Error creating SIP for user: {} and fund: {}", sipDTO.getUserId(), sipDTO.getFundId(), e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String updateSIP(String id, SIPDTO sipDTO) {
        try {
            log.info("Updating SIP with ID: {}", id);
            
            return registeredSIPRepository.findById(id)
                    .map(existingSIP -> {
                        existingSIP.setFundName(sipDTO.getFundName());
                        existingSIP.setFundId(sipDTO.getFundId());
                        existingSIP.setUserId(sipDTO.getUserId());
                        existingSIP.setAmount(sipDTO.getAmount());
                        
                        RegisteredSIP updatedSIP = registeredSIPRepository.save(existingSIP);
                        log.info("SIP with ID: {} updated successfully", id);
                        return "Success: SIP updated successfully with ID: " + id;
                    })
                    .orElseGet(() -> {
                        log.warn("SIP not found with ID: {}", id);
                        return "Error: SIP not found with ID: " + id;
                    });
        } catch (Exception e) {
            log.error("Error updating SIP with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteSIP(String id) {
        try {
            log.info("Deleting SIP with ID: {}", id);
            
            if (registeredSIPRepository.existsById(id)) {
                registeredSIPRepository.deleteById(id);
                log.info("SIP with ID: {} deleted successfully", id);
                return "Success: SIP deleted successfully with ID: " + id;
            } else {
                log.warn("SIP with ID: {} not found for deletion", id);
                return "Success: SIP not found with ID: " + id;
            }
        } catch (Exception e) {
            log.error("Error deleting SIP with ID: {}", id, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteSIPByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.info("Deleting SIP for user: {} and fund: {}", userId, fundId);
            
            List<RegisteredSIP> sipsToDelete = registeredSIPRepository.findByUserIdAndFundId(userId, fundId);
            if (!sipsToDelete.isEmpty()) {
                registeredSIPRepository.deleteAll(sipsToDelete);
                log.info("SIPs for user: {} and fund: {} deleted successfully", userId, fundId);
                return "Success: SIP deleted successfully for user: " + userId + " and fund: " + fundId;
            } else {
                log.warn("No SIPs found for user: {} and fund: {} for deletion", userId, fundId);
                return "Success: SIP not found for user: " + userId + " and fund: " + fundId;
            }
        } catch (Exception e) {
            log.error("Error deleting SIP for user: {} and fund: {}", userId, fundId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public String deleteAllSIPsByUserId(String userId) {
        try {
            log.info("Deleting all SIPs for user: {}", userId);
            
            List<RegisteredSIP> sipsToDelete = registeredSIPRepository.findByUserId(userId);
            long count = sipsToDelete.size();
            
            if (count > 0) {
                registeredSIPRepository.deleteAll(sipsToDelete);
                log.info("{} SIPs deleted for user: {}", count, userId);
                return "Success: " + count + " SIPs deleted for user: " + userId;
            } else {
                log.info("No SIPs found for user: {}", userId);
                return "Success: No SIPs found for user: " + userId;
            }
        } catch (Exception e) {
            log.error("Error deleting all SIPs for user: {}", userId, e);
            return "Error: " + e.getMessage();
        }
    }

    @Override
    public Double getTotalSIPAmountByUserId(String userId) {
        try {
            log.debug("Calculating total SIP amount for user: {}", userId);
            
            List<RegisteredSIP> sips = registeredSIPRepository.findByUserId(userId);
            double totalAmount = sips.stream()
                    .mapToDouble(RegisteredSIP::getAmount)
                    .sum();
            
            log.debug("Total SIP amount for user: {} = {}", userId, totalAmount);
            return totalAmount;
        } catch (Exception e) {
            log.error("Error calculating total SIP amount for user: {}", userId, e);
            return null;
        }
    }

    @Override
    public Double getTotalSIPAmountByUserIdAndFundId(String userId, Integer fundId) {
        try {
            log.debug("Calculating total SIP amount for user: {} and fund: {}", userId, fundId);
            
            List<RegisteredSIP> sips = registeredSIPRepository.findByUserIdAndFundId(userId, fundId);
            double totalAmount = sips.stream()
                    .mapToDouble(RegisteredSIP::getAmount)
                    .sum();
            
            log.debug("Total SIP amount for user: {} and fund: {} = {}", userId, fundId, totalAmount);
            return totalAmount;
        } catch (Exception e) {
            log.error("Error calculating total SIP amount for user: {} and fund: {}", userId, fundId, e);
            return null;
        }
    }

    @Override
    public Integer getSIPCountByUserId(String userId) {
        try {
            log.debug("Getting SIP count for user: {}", userId);
            
            List<RegisteredSIP> sips = registeredSIPRepository.findByUserId(userId);
            long count = sips.size();
            
            log.debug("SIP count for user: {} = {}", userId, count);
            return Math.toIntExact(count);
        } catch (Exception e) {
            log.error("Error getting SIP count for user: {}", userId, e);
            return null;
        }
    }

    private SIPDTO convertToDTO(RegisteredSIP sip) {
        return new SIPDTO(
                sip.getId(),
                sip.getFundName(),
                sip.getFundId(),
                sip.getUserId(),
                sip.getAmount()
        );
    }

    private RegisteredSIP convertToEntity(SIPDTO sipDTO) {
        RegisteredSIP sip = new RegisteredSIP();
        sip.setId(sipDTO.getId());
        sip.setFundName(sipDTO.getFundName());
        sip.setFundId(sipDTO.getFundId());
        sip.setUserId(sipDTO.getUserId());
        sip.setAmount(sipDTO.getAmount());
        return sip;
    }
}