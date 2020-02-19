package com.dnastack.ddap.ic.account.controller;

import com.dnastack.ddap.common.security.OAuthStateHandler;
import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;
import com.dnastack.ddap.common.util.http.UriUtil;
import com.dnastack.ddap.ic.oauth.client.ReactiveIdpOAuthClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.IC;
import static org.springframework.http.HttpHeaders.SET_COOKIE;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/identity")
public class AccountLinkingController {

    private static final String DEFAULT_SCOPES = "openid ga4gh_passport_v1 account_admin link identities";

    private ReactiveIdpOAuthClient oAuthClient;
    private UserTokenCookiePackager cookiePackager;
    private OAuthStateHandler stateHandler;

    @Autowired
    public AccountLinkingController(ReactiveIdpOAuthClient oAuthClient,
                                    UserTokenCookiePackager cookiePackager,
                                    OAuthStateHandler stateHandler) {
        this.oAuthClient = oAuthClient;
        this.cookiePackager = cookiePackager;
        this.stateHandler = stateHandler;
    }

    @GetMapping("/link")
    public Mono<? extends ResponseEntity<?>> initiateAccountLinking(ServerHttpRequest request,
                                                                    @PathVariable String realm,
                                                                    @RequestParam String provider) {
        Map<CookieName, UserTokenCookiePackager.CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(IC.cookieName(TokenKind.ACCESS), IC.cookieName(TokenKind.REFRESH)));
        final String targetAccountAccessToken = tokens.get(IC.cookieName(TokenKind.ACCESS)).getClearText();
        if (targetAccountAccessToken == null) {
            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization is invalid"));
        }

        final String state = stateHandler.generateAccountLinkingState(targetAccountAccessToken, realm);
        URI cookieDomainPath = UriUtil.selfLinkToApi(request, realm, "identity/token");

        final URI postLoginTokenEndpoint = UriUtil.selfLinkToApi(request, "identity/loggedIn");
        return Mono.just(ResponseEntity.status(HttpStatus.TEMPORARY_REDIRECT)
                .location(oAuthClient.getAuthorizeUrl(realm, state, DEFAULT_SCOPES, postLoginTokenEndpoint, provider))
                .header(SET_COOKIE, cookiePackager.packageToken(state, cookieDomainPath.getHost(), IC.cookieName(TokenKind.OAUTH_STATE)).toString())
                .build());
    }

}
