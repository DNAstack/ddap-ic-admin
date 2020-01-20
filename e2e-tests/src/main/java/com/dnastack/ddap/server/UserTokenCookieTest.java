package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

import static java.lang.String.format;
import static org.hamcrest.Matchers.isOneOf;
import static org.hamcrest.Matchers.not;

public class UserTokenCookieTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(UserTokenCookieTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        String icConfig = loadTemplate("/com/dnastack/ddap/icAdminConfig.json");
        setupIcConfig(TestingPersona.ADMINISTRATOR, icConfig, REALM);
    }

    @Test
    public void shouldIncludeValidAuthStatusInResponseHeader() throws Exception {
        final String accessToken = fetchRealPersonaIcToken(TestingPersona.USER_WITHOUT_ACCESS.getId(), REALM);

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", accessToken)
        .when()
            .get(scimUserInfo())
        .then()
            .log().body()
            .log().ifValidationFails()
            .header("X-DDAP-Authenticated", "true");
        // @formatter:on
    }

    public String scimUserInfo() {
        return format("/identity/scim/v2/%s/Me", REALM);
    }

    @Test
    public void shouldIncludeInvalidAuthStatusInResponseHeader() throws Exception {
        String expiredUserTokenCookie = fakeUserToken(Instant.now().minusSeconds(10));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", expiredUserTokenCookie)
        .when()
            .get(scimUserInfo())
        .then()
            .log().body()
            .log().ifValidationFails()
            .header("X-DDAP-Authenticated", "false");
        // @formatter:on
    }

    @Test
    public void shouldIncludeMissingAuthStatusInResponseHeader() throws Exception {
        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
        .when()
            .get(scimUserInfo())
        .then()
            .log().body()
            .log().ifValidationFails()
            .header("X-DDAP-Authenticated", "false");
        // @formatter:on
    }

    @Test
    public void shouldBeAbleToAccessICWithAppropriateCookie() throws IOException {
        String validPersonaToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", validPersonaToken)
        .when()
            .get(icViaDdap("/accounts/-"))
        .then()
            .log().everything()
            .contentType(not("text/html"))
            .statusCode(200);
        // @formatter:on
    }

    @Test
    public void expiredDamTokenShouldExpireUserTokenCookies() throws Exception {
        String expiredUserTokenCookie = fakeUserToken(Instant.now().minusSeconds(10));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", expiredUserTokenCookie)
            .when()
            .get(scimUserInfo())
            .then()
            .log().body()
            .log().ifValidationFails()
            .statusCode(isOneOf(401, 404))
            .cookie("ic_token", "expired");
        // @formatter:on
    }

    @Test
    public void expiredIcTokenShouldExpireUserTokenCookies() throws Exception {
        String expiredUserTokenCookie = fakeUserToken(Instant.now().minusSeconds(10));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", expiredUserTokenCookie)
            .when()
            .get(scimUserInfo())
            .then()
            .log().body()
            .log().ifValidationFails()
            .statusCode(isOneOf(401, 404))
            .cookie("ic_token", "expired");
        // @formatter:on
    }

    @Test
    public void staleDamTokenShouldExpireUserTokenCookies() throws Exception {
        String expiredUserTokenCookie = fakeClearTextUserToken(Instant.now().minusSeconds(10));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", expiredUserTokenCookie)
            .when()
            .get(scimUserInfo())
            .then()
            .log().body()
            .log().ifValidationFails()
            .statusCode(isOneOf(401, 404))
            .cookie("ic_token", "expired");
        // @formatter:on
    }

    @Test
    public void staleIcTokenShouldExpireUserTokenCookies() throws Exception {
        String expiredUserTokenCookie = fakeClearTextUserToken(Instant.now().minusSeconds(10));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie("ic_token", expiredUserTokenCookie)
            .when()
            .get(icViaDdap("/accounts/-"))
            .then()
            .log().body()
            .log().ifValidationFails()
            .statusCode(isOneOf(401, 404))
            .cookie("ic_token", "expired");
        // @formatter:on
    }

    private String icViaDdap(String path) {
        return format("/identity/v1alpha/%s%s", REALM, path);
    }

    private String fakeUserToken(Instant exp) throws JsonProcessingException {
        TextEncryptor encryptor = Encryptors.text(DDAP_COOKIES_ENCRYPTOR_PASSWORD, DDAP_COOKIES_ENCRYPTOR_SALT);
        return encryptor.encrypt(fakeClearTextUserToken(exp));
    }

    private String fakeClearTextUserToken(Instant exp) throws JsonProcessingException {
        // Note this will only work so long as DDAP frontend uses unencrypted DAM access tokens as cookie value
        ObjectMapper jsonMapper = new ObjectMapper();
        Base64.Encoder b64Encoder = Base64.getUrlEncoder().withoutPadding();

        Map<String, Object> header = ImmutableMap.of(
            "typ", "JWT",
            "alg", "none");
        Map<String, Object> body = ImmutableMap.of(
            "exp", exp.getEpochSecond());

        return b64Encoder.encodeToString(jsonMapper.writeValueAsBytes(header)) +
            "." +
            b64Encoder.encodeToString(jsonMapper.writeValueAsBytes(body)) +
            ".";
    }
}
