package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import org.apache.http.cookie.Cookie;
import org.json.JSONObject;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;

import static com.dnastack.ddap.common.util.WebDriverCookieHelper.SESSION_COOKIE_NAME;
import static java.lang.String.format;
import static org.hamcrest.Matchers.*;

@SuppressWarnings("Duplicates")
public class IdentityE2eTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(IdentityE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        String icConfig = loadTemplate("/com/dnastack/ddap/icAdminConfig.json");
        setupIcConfig(TestingPersona.ADMINISTRATOR, icConfig, REALM);
    }

    private String ddap(String path) {
        return format("/api/v1alpha/realm/%s%s", REALM, path);
    }

    @Test
    public void testScopes() throws Exception {
        String requestedScope = "link";
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "openid");
        String damToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_token", icToken)
                .cookie("dam_token", damToken)
                .cookie("refresh_token", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("scopes", not(contains("link")));
        // @formatter:on

        icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "openid", requestedScope);
        damToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_token", icToken)
                .cookie("dam_token", damToken)
                .cookie("refresh_token", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("scopes", hasItem(requestedScope));
        // @formatter:on
    }

    @Test
    public void testAccount() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");
        String danToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_token", icToken)
                .cookie("dam_token", danToken)
                .cookie("refresh_token", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("accesses", not(empty()))
                .body("account.connectedAccounts", not(empty()))
                // Where the email is in the payload depends on if we use personas or wallet for test users
                .body(containsString(TestingPersona.USER_WITH_ACCESS.getEmail()));
        // @formatter:on
    }

    @Test
    public void testIcUserAccessAsAdmin() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.ADMINISTRATOR, REALM, "");
        String danToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        JSONObject expectedIcAccess = new JSONObject();
        expectedIcAccess.put("isAdmin", true);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_token", icToken)
                .cookie("dam_token", danToken)
                .cookie("refresh_token", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity/access"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body(".", equalTo(expectedIcAccess.toMap()));
        // @formatter:on
    }

    @Test
    public void testIcUserAccessAsNonAdmin() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");
        String danToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        JSONObject expectedIcAccess = new JSONObject();
        expectedIcAccess.put("isAdmin", false);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_token", icToken)
                .cookie("dam_token", danToken)
                .cookie("refresh_token", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity/access"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body(".", equalTo(expectedIcAccess.toMap()));
        // @formatter:on
    }

}
