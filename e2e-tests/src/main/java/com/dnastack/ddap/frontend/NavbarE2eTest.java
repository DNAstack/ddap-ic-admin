package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.ICLoginPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.TestingPersona.USER_WITHOUT_ACCESS;
import static com.dnastack.ddap.common.fragments.NavBar.*;
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
    public void verifyNonAdminAccess() {
        ddapPage = doBrowserLogin(REALM, USER_WITHOUT_ACCESS, AdminDdapPage::new);

        ddapPage.getNavBar()
                .assertNonAdminNavBar();

        assertThat(ddapPage.getNavBar().existsInNavBar(icIdentityProvidersLink()), is(false));
        assertThat(ddapPage.getNavBar().existsInNavBar(identityManagementPanelSelectorLink()), is(true));
    }

    @Test
    public void logoutShouldGoToIcLoginForCurrentRealmAndRemoveCookies() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        // check if cookies are present on landing page
        assertThat(driver.manage().getCookieNamed("ic_identity"), notNullValue());
        assertThat(driver.manage().getCookieNamed("ic_access"), notNullValue());
        assertThat(driver.manage().getCookieNamed("ic_refresh"), notNullValue());

        ICLoginPage icLoginPage = ddapPage.getNavBar().logOut();
        ddapPage.waitForInflightRequests();

        // check if cookies are not present on landing page without logging in
        driver.get(getUrlWithBasicCredentials(DDAP_BASE_URL));
        assertThat(driver.manage().getCookieNamed("ic_identity"), nullValue());
        assertThat(driver.manage().getCookieNamed("ic_access"), nullValue());
        assertThat(driver.manage().getCookieNamed("ic_refresh"), nullValue());
    }

    @Test
    public void testProfileName() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);
        ddapPage.getNavBar().openProfileMenu();
        // check profile name
        final WebElement profileNameElement = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("nav-profile-name")));
        final String displayedName = profileNameElement.getText();
        assertThat(displayedName, not(isEmptyOrNullString()));

        /*
        We can't assert that the name is "Administrator" because if the tests are run with the WalletLoginStrategy,
        we want anyone's admin account to work. This is a low-quality check that the string here is probably a name.
         */
        final String firstLetter = displayedName.trim().substring(0, 1);
        assertEquals(format("Expected name [%s] to start with capital. Might not be a name?", displayedName), firstLetter.toUpperCase(), firstLetter);
    }

    @Test
    public void testPanelExpandedAfterRefresh() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(usersLink());
        final String usersButtonSelector = "nav-admin-users";

        adminListPage.assertElementVisible(usersButtonSelector);
        driver.navigate().refresh();
        adminListPage.assertElementVisible(usersButtonSelector);
    }

}
