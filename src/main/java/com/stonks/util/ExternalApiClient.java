package com.stonks.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExternalApiClient {

    private final RestTemplate restTemplate;

    public <T> Optional<T> get(String url, Map<String, String> queryParams, Class<T> responseType, Map<String, String> headers) {
        URI uri = buildUri(url, queryParams);
        HttpHeaders httpHeaders = buildHeaders(headers);
        HttpEntity<Void> entity = new HttpEntity<>(httpHeaders);
        try {
            ResponseEntity<T> response = restTemplate.exchange(uri, HttpMethod.GET, entity, responseType);
            return Optional.of(response.getBody());
        } catch (HttpStatusCodeException ex) {
            // Consider logging the response body for diagnostics in a real system
            return Optional.empty();
        }
    }

    public <B, T> Optional<T> post(String url, Map<String, String> queryParams, B body, Class<T> responseType, Map<String, String> headers) {
        URI uri = buildUri(url, queryParams);
        HttpHeaders httpHeaders = buildHeaders(headers);
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<B> entity = new HttpEntity<>(body, httpHeaders);
        try {
            ResponseEntity<T> response = restTemplate.exchange(uri, HttpMethod.POST, entity, responseType);
            return Optional.of(response.getBody());
        } catch (HttpStatusCodeException ex) {
            // Consider logging the response body for diagnostics in a real system
            return Optional.empty();
        }
    }

    private static URI buildUri(String url, Map<String, String> queryParams) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url);
        if (queryParams != null) {
            queryParams.forEach(builder::queryParam);
        }
        return builder.build(true).toUri();
    }

    private static HttpHeaders buildHeaders(Map<String, String> headers) {
        HttpHeaders httpHeaders = new HttpHeaders();
        if (headers != null) {
            headers.forEach(httpHeaders::add);
        }
        return httpHeaders;
    }
}


