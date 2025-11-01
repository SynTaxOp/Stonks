package com.stonks.controller;

import java.util.List;

import com.stonks.dto.BaseResponse;
import com.stonks.dto.SIPDTO;
import com.stonks.service.SIPService;
import com.stonks.service.UserFundService;
import com.stonks.util.Response;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sip")
@RequiredArgsConstructor
public class SIPController {

    private final SIPService sipService;
    private final UserFundService userFundService;

    @PostMapping
    public ResponseEntity<BaseResponse<?>> addSip(@Valid @RequestBody SIPDTO sipdto) {
        return Response.success(userFundService.registerNewSIP(sipdto));
    }

    @PutMapping
    public ResponseEntity<BaseResponse<?>> updateSip(@RequestParam String id, @Valid @RequestBody SIPDTO sipdto) {
        String result = sipService.updateSIP(id, sipdto);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

    @DeleteMapping
    public ResponseEntity<BaseResponse<?>> deleteSip(String id) {
        String result = sipService.deleteSIP(id);
        if (result.startsWith("Success:")) {
            return Response.success(result);
        } else {
            return Response.failure(result);
        }
    }

    @GetMapping
    public ResponseEntity<BaseResponse<?>> getAllSips(@RequestParam(value = "userId") String userId) {
        List<SIPDTO> sips = sipService.getSIPsByUserId(userId);
        return Response.success(sips);
    }


}