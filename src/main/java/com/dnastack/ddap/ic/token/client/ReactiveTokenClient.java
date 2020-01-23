package com.dnastack.ddap.ic.token.client;

import com.dnastack.ddap.common.client.ProtobufDeserializer;
import com.dnastack.ddap.common.client.WebClientFactory;
import com.dnastack.ddap.ic.common.config.IdpProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriTemplate;
import reactor.core.publisher.Mono;
import tokens.v1.TokenService;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Slf4j
@Component
public class ReactiveTokenClient {

    private IdpProperties idpProperties;

    public ReactiveTokenClient(IdpProperties idpProperties) {
        this.idpProperties = idpProperties;
    }

    public Mono<TokenService.ListTokensResponse> getTokens(String icToken, TokenService.ListTokensRequest request) {
        final UriTemplate template = new UriTemplate("/tokens" +
            "?client_id={clientId}" +
            "&client_secret={clientSecret}" +
            "&parent={parent}" +
            "&pageToken={pageToken}" +
            "&pageSize={pageSize}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("clientId", idpProperties.getClientId());
        variables.put("clientSecret", idpProperties.getClientSecret());
        variables.put("parent", request.getParent());
        variables.put("pageToken", request.getPageToken());
        variables.put("pageSize", request.getPageSize());

        return WebClientFactory.getWebClient()
            .get()
            .uri(idpProperties.getBaseUrl().resolve(template.expand(variables)))
            .header(AUTHORIZATION, "Bearer " + icToken)
            .retrieve()
            .bodyToMono(String.class)
            .flatMap(json -> ProtobufDeserializer.fromJsonToMono(json, TokenService.ListTokensResponse.getDefaultInstance()));
    }

    public Mono<Object> revokeToken(String icToken, TokenService.DeleteTokenRequest request) {
        final UriTemplate template = new UriTemplate("/tokens/{tokenName}" +
            "?client_id={clientId}" +
            "&client_secret={clientSecret}");
        final Map<String, Object> variables = new HashMap<>();
        variables.put("clientId", idpProperties.getClientId());
        variables.put("clientSecret", idpProperties.getClientSecret());
        variables.put("tokenName", request.getName());

        return WebClientFactory.getWebClient()
            .delete()
            .uri(idpProperties.getBaseUrl().resolve(template.expand(variables)))
            .header(AUTHORIZATION, "Bearer " + icToken)
            .retrieve()
            .bodyToMono(Object.class);
    }

}
