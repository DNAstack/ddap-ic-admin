package com.dnastack.ddap.ic.admin.client;

import com.dnastack.ddap.common.client.AuthAwareWebClientFactory;
import com.dnastack.ddap.common.client.OAuthFilter;
import com.dnastack.ddap.ic.common.config.IcProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Component
public class ReactiveAdminIcClient {

    private IcProperties icProperties;
    private AuthAwareWebClientFactory webClientFactory;

    public ReactiveAdminIcClient(IcProperties icProperties, AuthAwareWebClientFactory webClientFactory) {
        this.icProperties = icProperties;
        this.webClientFactory = webClientFactory;
    }

    public Mono<Object> getConfig(String realm, String accessToken, String refreshToken) {
        final UriTemplate template = new UriTemplate("/identity/v1alpha/{realm}/config" +
                "?client_id={clientId}" +
                "&client_secret={clientSecret}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("realm", realm);
        variables.put("clientId", icProperties.getClientId());
        variables.put("clientSecret", icProperties.getClientSecret());

        return webClientFactory
                .getWebClient(realm, refreshToken, OAuthFilter.Audience.IC)
                .get()
                .uri(icProperties.getBaseUrl().resolve(template.expand(variables)))
                .header(AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Object.class)
                // Sometimes IC fails with transaction error on first try
                .retryBackoff(2, Duration.ofMillis(200));
    }

}
