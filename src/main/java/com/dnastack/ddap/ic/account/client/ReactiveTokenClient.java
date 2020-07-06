package com.dnastack.ddap.ic.account.client;

import com.dnastack.ddap.common.client.AuthAwareWebClientFactory;
import com.dnastack.ddap.common.client.OAuthFilter;
import com.dnastack.ddap.common.client.ProtobufDeserializer;
import com.dnastack.ddap.ic.common.config.IcProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;
import tokens.v1.TokensOuterClass;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Component
public class ReactiveTokenClient {

    private IcProperties icProperties;
    private final AuthAwareWebClientFactory webClientFactory;

    public ReactiveTokenClient(IcProperties icProperties, AuthAwareWebClientFactory webClientFactory) {
        this.icProperties = icProperties;
        this.webClientFactory = webClientFactory;
    }

    public Mono<TokensOuterClass.ListTokensResponse> getTokens(String realm, String userId, String accessToken, String refreshToken) {
        final UriTemplate template = new UriTemplate("/identity/v1alpha/users/{userId}/tokens" +
            "?client_id={clientId}" +
            "&client_secret={clientSecret}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("userId", userId);
        variables.put("clientId", icProperties.getClientId());
        variables.put("clientSecret", icProperties.getClientSecret());

        return webClientFactory
            .getWebClient(realm, refreshToken, OAuthFilter.Audience.IC)
            .get()
            .uri(icProperties.getBaseUrl().resolve(template.expand(variables)))
            .header(AUTHORIZATION, "Bearer " + accessToken)
            .retrieve()
            .bodyToMono(String.class)
            .flatMap(json -> ProtobufDeserializer.fromJsonToMono(json, TokensOuterClass.ListTokensResponse.getDefaultInstance()))
            // Sometimes IC fails with transaction error on first try
            .retryBackoff(2, Duration.ofMillis(200));
    }

}
