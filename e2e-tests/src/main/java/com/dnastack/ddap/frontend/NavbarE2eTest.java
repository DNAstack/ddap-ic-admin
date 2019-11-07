package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.ICLoginPage;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.TestingPersona.USER_WITHOUT_ACCESS;
import static com.dnastack.ddap.common.fragments.NavBar.icIdentityProvidersLink;
import static java.lang.String.format;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertEquals;

@SuppressWarnings("Duplicates")
public class NavbarE2eTest extends AbstractFrontendE2eTest {

    private static final String REALM = generateRealmName(NavbarE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        String icConfig = loadTemplate("/com/dnastack/ddap/icAdminConfig.json");
        setupIcConfig(TestingPersona.ADMINISTRATOR, icConfig, REALM);
    }

    @Test
    public void verifyAdminAccess() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        ddapPage.getNavBar()
                .assertAdminNavBar();

        ddapPage.getNavBar().logOut();
        ddapPage = doBrowserLogin(REALM, USER_WITHOUT_ACCESS, AdminDdapPage::new);

        assertThat(ddapPage.getNavBar().existsInNavBar(icIdentityProvidersLink()), is(false));
    }

    @Test
    public void logoutShouldGoToIcLoginForCurrentRealmAndRemoveCookies() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        // check if cookies are present on landing page
        assertThat(driver.manage().getCookieNamed("dam_token"), notNullValue());
        assertThat(driver.manage().getCookieNamed("ic_token"), notNullValue());
        assertThat(driver.manage().getCookieNamed("refresh_token"), notNullValue());

        ICLoginPage icLoginPage = ddapPage.getNavBar().logOut();
        ddapPage.waitForInflightRequests();
        assertThat(icLoginPage.getRealm(), is(REALM));

        // check if cookies are not present on landing page without logging in
        driver.get(getUrlWithBasicCredentials(DDAP_BASE_URL));
        assertThat(driver.manage().getCookieNamed("dam_token"), nullValue());
        assertThat(driver.manage().getCookieNamed("ic_token"), nullValue());
        assertThat(driver.manage().getCookieNamed("refresh_token"), nullValue());
    }

    @Test
    public void testProfileName() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        // check profile name
        final String usernameXpath = "//*[@data-se='nav-account']//h4";
        final String displayedName = driver.findElement(By.xpath(usernameXpath)).getText();
        assertThat(displayedName, not(isEmptyOrNullString()));

        /*
        We can't assert that the name is "Administrator" because if the tests are run with the WalletLoginStrategy,
        we want anyone's admin account to work. This is a low-quality check that the string here is probably a name.
         */
        final String firstLetter = displayedName.trim().substring(0, 1);
        assertEquals(format("Expected name [%s] to start with capital. Might not be a name?", displayedName), firstLetter.toUpperCase(), firstLetter);
    }

}
