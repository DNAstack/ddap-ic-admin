package com.dnastack.ddap.ic.account.controller;

import com.dnastack.ddap.common.security.OAuthStateHandler;
import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieKind;
import com.dnastack.ddap.common.util.http.UriUtil;
import com.dnastack.ddap.ic.common.security.JwtUtil;
import com.dnastack.ddap.ic.oauth.client.ReactiveIcOAuthClient;
import com.dnastack.ddap.ic.oauth.model.TokenResponse;
import com.dnastack.ddap.ic.service.AccountLinkingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.beans.PropertyEditorSupport;
import java.net.URI;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.springframework.http.HttpHeaders.SET_COOKIE;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/identity")
public class AccountLinkingController {

    private static final String DEFAULT_SCOPES = "openid ga4gh_passport_v1 account_admin identities";

    private ReactiveIcOAuthClient oAuthClient;
    private UserTokenCookiePackager cookiePackager;
    private OAuthStateHandler stateHandler;
    private AccountLinkingService accountLinkingService;

    @Autowired
    public AccountLinkingController(ReactiveIcOAuthClient oAuthClient,
                                    UserTokenCookiePackager cookiePackager,
                                    OAuthStateHandler stateHandler,
                                    AccountLinkingService accountLinkingService) {
        this.oAuthClient = oAuthClient;
        this.cookiePackager = cookiePackager;
        this.stateHandler = stateHandler;
        this.accountLinkingService = accountLinkingService;
    }

    @DeleteMapping(value = "/link/{subjectName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<? extends ResponseEntity<?>> unlinkAccount(ServerHttpRequest request,
                                                           @PathVariable String realm,
                                                           @PathVariable String subjectName) {
        final Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.IC, CookieKind.REFRESH));
        final String targetAccountId = JwtUtil.dangerousStopgapExtractSubject(tokens.get(CookieKind.IC).getClearText()).map(JwtUtil.JwtSubject::getSub).orElse(null);
        if (targetAccountId == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization is invalid"));
        }
        final Map<CookieKind, String> clearTextTokens = tokens.entrySet()
                                                              .stream()
                                                              .collect(Collectors.toMap(Map.Entry::getKey,
                                                                                        e -> e.getValue().getClearText()));

        Mono<String> unlinkAccountMono = accountLinkingService.unlinkAccount(realm, clearTextTokens, subjectName);
        Mono<TokenResponse> refreshAccessTokenMono = oAuthClient.refreshAccessToken(realm, clearTextTokens.get(CookieKind.REFRESH), null);

        return unlinkAccountMono.then(refreshAccessTokenMono)
                .flatMap((tokenResponse) -> {
                    URI cookieDomainPath = UriUtil.selfLinkToApi(request, realm, "identity/token");
                    return Mono.just(ResponseEntity.status(200)
                            .header(SET_COOKIE, cookiePackager.packageToken(tokenResponse.getAccessToken(), cookieDomainPath.getHost(), CookieKind.IC).toString())
                            .header(SET_COOKIE, cookiePackager.packageToken(tokenResponse.getIdToken(), cookieDomainPath.getHost(), CookieKind.DAM).toString())
                            .build());
                });
    }

    @GetMapping("/link")
    public Mono<? extends ResponseEntity<?>> initiateAccountLinking(ServerHttpRequest request,
                                                                    @PathVariable String realm,
                                                                    @RequestParam String provider) {
        Map<CookieKind, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(CookieKind.IC, CookieKind.REFRESH));
        final String targetAccountId = JwtUtil.dangerousStopgapExtractSubject(tokens.get(CookieKind.IC).getClearText()).map(JwtUtil.JwtSubject::getSub).orElse(null);
        if (targetAccountId == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization is invalid"));
        }

        final String scopes = format("%s link:%s", DEFAULT_SCOPES, targetAccountId);
        final String state = stateHandler.generateAccountLinkingState(targetAccountId, realm);
        URI cookieDomainPath = UriUtil.selfLinkToApi(request, realm, "identity/token");

        final URI ddapTokenEndpoint = UriUtil.selfLinkToApi(request, realm, "identity/token");
        return Mono.just(ResponseEntity.status(HttpStatus.TEMPORARY_REDIRECT)
                .location(oAuthClient.getAuthorizeUrl(realm, state, scopes, ddapTokenEndpoint, provider))
                .header(SET_COOKIE, cookiePackager.packageToken(state, cookieDomainPath.getHost(), CookieKind.OAUTH_STATE).toString())
                .build());
    }

}
