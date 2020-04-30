package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.UserAdminListPage;
import com.dnastack.ddap.common.page.UserAdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.util.Optional;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.fragments.NavBar.usersLink;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminUsersE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void closeOwnAccount() {
        UserAdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(usersLink(), UserAdminListPage::new);

        String user = optionalEnv("E2E_ADMIN_USER_NAME", "Monica Valluri");
        // There might be multiple users with same name (from previous test runs),
        // want to close the only active user which is the logged in user. Closing already inactive account
        // would not do anything.
        adminListPage.setActiveUsersOnly();
        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        assertTrue("No active user present", activeUser.isPresent());
        activeUser.ifPresent(adminListPage::closeAccount);

        // Expecting to be on root url and having invalidated all cookies except SESSION
        assertTrue(driver.getCurrentUrl().endsWith("/dnastack"));
        // This check isn't reliable locally because we may have all webapps running on this domain
        if (!driver.getCurrentUrl().startsWith("http://localhost")) {
            assertThat(driver.manage().getCookies(), hasSize(1));
            assertThat(driver.manage().getCookieNamed("SESSION"), notNullValue());
        }
    }

    @Test
    public void updateAccountInformation() {
        ddapPage = doBrowserLogin(getRealm(), ADMINISTRATOR, AdminDdapPage::new);

        UserAdminListPage adminListPage = ddapPage.getNavBar()
            .goTo(usersLink(), UserAdminListPage::new);

        String user = optionalEnv("E2E_ADMIN_USER_NAME", "Monica Valluri");
        // There might be multiple users with same name (from previous test runs),
        // want to close the only active user which is the logged in user. Closing already inactive account
        // would not do anything.
        adminListPage.setActiveUsersOnly();
        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        assertTrue("No active user present", activeUser.isPresent());

        UserAdminManagePage adminManagePage = adminListPage.editAccount(activeUser.get());
        // Don't change name, because it will affect future runs of test
        adminManagePage.replaceField(DdapBy.se("inp-displayName"), user);
        adminManagePage.replaceField(DdapBy.se("inp-locale"), "en_US");
        adminManagePage.replaceField(DdapBy.se("inp-timezone"), "Europe/Bratislava");
        adminManagePage.toggleExpansionPanel("email-0");
        try {
            // Try to make email primary. There won't be this button if email is already primary
            adminManagePage.clickButton(DdapBy.se("btn-make-primary-email-0"));
        } catch (NoSuchElementException nsee) {
            // If there is no button for making mail primary check if the email is primary
            driver.findElement(DdapBy.se("primary-email-0"));
        }
        adminListPage = adminManagePage.updateEntity();

        assertTrue(adminListPage.getFirstUserByNameAndActivity(user, true).isPresent());
    }

}
