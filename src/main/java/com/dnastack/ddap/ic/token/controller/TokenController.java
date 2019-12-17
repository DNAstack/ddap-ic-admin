package com.dnastack.ddap.ic.token.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.ic.token.client.ReactiveTokenClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import tokens.v1.TokenService;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieKind;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/tokens")
public class TokenController {

    private ReactiveTokenClient tokenClient;
    private UserTokenCookiePackager cookiePackager;

    @Autowired
    public TokenController(ReactiveTokenClient tokenClient, UserTokenCookiePackager cookiePackager) {
        this.tokenClient = tokenClient;
        this.cookiePackager = cookiePackager;
    }

    @GetMapping
    public Mono<? extends ResponseEntity<?>> getTokens(ServerHttpRequest request,
                                                       @RequestParam(required = false) String parent,
                                                       @RequestParam(required = false) Integer pageSize,
                                                       @RequestParam(required = false) String pageToken) {
        Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.IC));

        TokenService.ListTokensRequest listRequest = TokenService.ListTokensRequest.newBuilder()
            .setParent(parent != null ? parent : "")
            .setPageSize(pageSize != null ? pageSize : 20)
            .setPageToken(pageToken != null ? pageToken : "")
            .build();
        Mono<TokenService.ListTokensResponse> tokensMono = tokenClient.getTokens(tokens.get(CookieKind.IC).getClearText(), listRequest);

        return tokensMono.flatMap(t -> Mono.just(ResponseEntity.ok().body(t)));
    }

    @DeleteMapping(value = "/{tokenId}")
    public Mono<? extends ResponseEntity<?>> revokeToken(ServerHttpRequest request,
                                                       @PathVariable String tokenId) {
        Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.IC));

        TokenService.DeleteTokenRequest deleteRequest = TokenService.DeleteTokenRequest.newBuilder()
            .setName(tokenId)
            .build();
        Mono<Object> tokensMono = tokenClient.revokeToken(tokens.get(CookieKind.IC).getClearText(), deleteRequest);

        return tokensMono.flatMap(t -> Mono.just(ResponseEntity.noContent().build()));
    }

}
