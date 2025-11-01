package com.stonks.util;

import com.stonks.dto.BaseResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class Response {

    public static ResponseEntity<BaseResponse<?>> success(Object data) {
        BaseResponse<Object> res = new BaseResponse<>();

        res.setSuccess(true);
        res.setData(data);
        res.setMessage("Success");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    public static ResponseEntity<BaseResponse<?>> success(Object data, String message) {
        BaseResponse<Object> res = new BaseResponse<>();

        res.setSuccess(true);
        res.setData(data);
        res.setMessage(message);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    public static ResponseEntity<BaseResponse<?>> failure(HttpStatus httpStatus, Object data, String message) {
        BaseResponse<Object> res = new BaseResponse<>();

        res.setSuccess(false);
        res.setData(data);
        res.setMessage(message);

        return new ResponseEntity<>(res, httpStatus);
    }

    public static ResponseEntity<BaseResponse<?>> failure(String message) {
        BaseResponse<Object> res = new BaseResponse<>();

        res.setSuccess(false);
        res.setMessage(message);

        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
}
