package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import io.restassured.http.ContentType;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;

import static java.lang.String.format;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;

@SuppressWarnings("Duplicates")
public class TokensE2eTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(TokensE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        String icConfig = loadTemplate("/com/dnastack/ddap/icAdminConfig.json");
        setupIcConfig(TestingPersona.ADMINISTRATOR, icConfig, REALM);
    }

    private String ddap(String path) {
        return format("/api/v1alpha/realm%s", path);
    }

    @Test
    public void testGetTokens() throws Exception {
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
                .cookie("ic_token", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .get(ddap("/tokens"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("tokens", hasSize(greaterThan(0)));
        // @formatter:on
    }

    @Test
    public void testRevokeToken() throws Exception {
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");

        // @formatter:off
        String tokenId = getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
                .cookie("ic_token", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .get(ddap("/tokens"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("tokens", hasSize(greaterThan(0)))
                .extract()
                .body()
                .jsonPath()
                .getString("tokens[0].name");
        // @formatter:on

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
                .cookie("ic_token", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .delete(ddap("/tokens/" + tokenId))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(204);
        // @formatter:on
    }

}
