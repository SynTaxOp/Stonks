package com.stonks.exception;

import com.stonks.dto.BaseResponse;
import com.stonks.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionResolver {


    @ExceptionHandler(ApiException.class)
    public ResponseEntity<BaseResponse<?>> handleApiException(ApiException e) {
        log.error(e.getMessage(), e);

        return Response.failure(e.getHttpStatus(), null, e.getMessage());
    }
}
