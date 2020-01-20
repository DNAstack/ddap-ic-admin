package com.dnastack.ddap.ic.admin.controller;

import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieName;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.CookieValue;
import com.dnastack.ddap.common.security.UserTokenCookiePackager.TokenKind;
import com.dnastack.ddap.ic.admin.model.UserAccess;
import com.dnastack.ddap.ic.admin.service.IcAdminAccessTester;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.IC;

@Slf4j
@RestController
@RequestMapping("/api/v1alpha/realm/{realm}/identity")
public class IcAdminController {

    private UserTokenCookiePackager cookiePackager;
    private IcAdminAccessTester accessTesterClient;

    @Autowired
    public IcAdminController(UserTokenCookiePackager cookiePackager,
                             IcAdminAccessTester accessTesterClient) {
        this.cookiePackager = cookiePackager;
        this.accessTesterClient = accessTesterClient;
    }

    @GetMapping(value = "/access")
    public Mono<? extends ResponseEntity<?>> getAccess(ServerHttpRequest request, @PathVariable String realm) {
        Map<CookieName, CookieValue> tokens = cookiePackager.extractRequiredTokens(request, Set.of(IC.cookieName(TokenKind.ACCESS), IC.cookieName(TokenKind.REFRESH)));

        Mono<UserAccess> accessesMono = accessTesterClient.determineAccessForUser(realm, tokens);

        return accessesMono.flatMap(access -> Mono.just(ResponseEntity.ok().body(access)));
    }

}
