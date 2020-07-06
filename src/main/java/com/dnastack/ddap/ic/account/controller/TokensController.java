package com.dnastack.ddap.ic.account.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.ic.account.client.ReactiveTokenClient;
import com.dnastack.ddap.ic.account.service.TokensExperimentalFeaturesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.*;
import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.IC;

/**
 * NOTE: this is controller exists to support experimental features
 */
@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/users/{userId}/tokens")
public class TokensController {

    @Value("${ddap.enable-experimental}")
    private Boolean experimentalEnabled;

    private final ReactiveTokenClient tokenClient;
    private final UserTokenCookiePackager cookiePackager;
    private final TokensExperimentalFeaturesService experimentalFeaturesService;

    @Autowired
    public TokensController(
        ReactiveTokenClient tokenClient,
        UserTokenCookiePackager cookiePackager,
        TokensExperimentalFeaturesService experimentalFeaturesService
    ) {
        this.tokenClient = tokenClient;
        this.cookiePackager = cookiePackager;
        this.experimentalFeaturesService = experimentalFeaturesService;
    }

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTokens(
        ServerHttpRequest request,
        @PathVariable String realm,
        @PathVariable String userId) {
        Map<CookieName, UserTokenCookiePackager.CookieValue> cookies = cookiePackager
            .extractRequiredTokens(request, Set.of(IC.cookieName(TokenKind.ACCESS), IC.cookieName(TokenKind.REFRESH)));
        UserTokenCookiePackager.CookieValue accessToken = cookies.get(IC.cookieName(TokenKind.ACCESS));
        UserTokenCookiePackager.CookieValue refreshToken = cookies.get(IC.cookieName(TokenKind.REFRESH));
        if (accessToken == null || refreshToken == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization is invalid"));
        }
        return tokenClient.getTokens(realm, userId, accessToken.getClearText(), refreshToken.getClearText())
            .flatMap(tokensResponse -> {
                if (experimentalEnabled) {
                    return Mono.just(ResponseEntity.ok()
                        .body(experimentalFeaturesService.addResourcesIfNotExist(tokensResponse)));
                }
                return Mono.just(ResponseEntity.ok().body(tokensResponse));
            });
    }

}
