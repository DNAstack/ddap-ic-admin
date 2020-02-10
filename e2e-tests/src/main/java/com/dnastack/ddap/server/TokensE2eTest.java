package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import io.restassured.http.ContentType;
import org.apache.http.cookie.Cookie;
import org.junit.Assume;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import static com.dnastack.ddap.common.util.WebDriverCookieHelper.SESSION_COOKIE_NAME;
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

    private String admin(String path) {
        return format("/identity/v1alpha/%s/admin%s", REALM, path);
    }

    @Test
    public void testGetTokensAsNonAdmin() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().cookies()
            .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .cookie("ic_access", icToken)
            .redirects().follow(false)
            .when()
            .accept(ContentType.JSON)
            .get(admin("/tokens"))
            .then()
            .log().body()
            .log().ifValidationFails()
            .statusCode(403);
        // @formatter:on
    }

    @Test
    public void testGetTokens() throws Exception {
        // No mock data are returned. Ignoring until breakage is fixed
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 2, 29, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));

        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.ADMINISTRATOR, REALM, "");

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_access", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .get(admin("/tokens"))
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
        // No mock data are returned. Ignoring until breakage is fixed
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 2, 29, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));

        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.ADMINISTRATOR, REALM, "");

        // @formatter:off
        String tokenId = getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_access", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .get(admin("/tokens"))
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
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_access", icToken)
                .redirects().follow(false)
                .when()
                .accept(ContentType.JSON)
                .delete(admin("/tokens/" + tokenId))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(204);
        // @formatter:on
    }

}
