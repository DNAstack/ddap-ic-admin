package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.UserAdminListPage;
import com.dnastack.ddap.common.page.UserAdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.openqa.selenium.WebElement;

import java.util.Optional;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.fragments.NavBar.usersLink;
import static java.lang.String.format;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeThat;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminUsersE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void closeOwnAccount() {
        UserAdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(usersLink(), UserAdminListPage::new);

        String user = "Monica Valluri";
        // There might be multiple users with same name (from previous test runs),
        // want to close the only active user which is the logged in user. Closing already inactive account
        // would not do anything.
        adminListPage.setActiveUsersOnly();
        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        // NOTE: this will be fixed once ACTIVE radio button works (blocked by IC update
        // https://github.com/GoogleCloudPlatform/healthcare-federated-access-services/commit/015c0ffc38e60fc703c9c45533cb8b35af68b5b7)
        // Once merge delete line below
        assumeThat(format("No active user [%s] visible. This might be due big number of users.", user), activeUser.isPresent(), equalTo(true));

        assertTrue("No active user present", activeUser.isPresent());
        activeUser.ifPresent(adminListPage::closeAccount);

        // Expecting to be on root url and having invalidated all cookies except SESSION
        assertTrue(driver.getCurrentUrl().endsWith("/dnastack"));
        assertThat(driver.manage().getCookies(), hasSize(1));
        assertThat(driver.manage().getCookieNamed("SESSION"), notNullValue());
    }

    @Test
    public void updateAccountInformation() {
        ddapPage = doBrowserLogin(getRealm(), ADMINISTRATOR, AdminDdapPage::new);

        UserAdminListPage adminListPage = ddapPage.getNavBar()
            .goTo(usersLink(), UserAdminListPage::new);

        String user = "Monica Valluri";
        // There might be multiple users with same name (from previous test runs),
        // want to close the only active user which is the logged in user. Closing already inactive account
        // would not do anything.
        adminListPage.setActiveUsersOnly();
        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        // NOTE: this will be fixed once ACTIVE radio button works (blocked by IC update
        // https://github.com/GoogleCloudPlatform/healthcare-federated-access-services/commit/015c0ffc38e60fc703c9c45533cb8b35af68b5b7)
        // Once merge delete line below
        assumeThat(format("No active user [%s] visible. This might be due big number of users.", user), activeUser.isPresent(), equalTo(true));

        assertTrue("No active user present", activeUser.isPresent());

        UserAdminManagePage adminManagePage = adminListPage.editAccount(activeUser.get());
        adminManagePage.fillField(DdapBy.se("inp-displayName"), "This is my Clone");
        adminManagePage.fillField(DdapBy.se("inp-locale"), "en_US");
        adminManagePage.fillField(DdapBy.se("inp-timezone"), "Europe/Bratislava");
        adminManagePage.toggleExpansionPanel("email-0");
        adminManagePage.clickButton(DdapBy.se("btn-make-primary-email-0"));
        adminListPage = adminManagePage.updateEntity();

        assertTrue(adminListPage.getFirstUserByNameAndActivity("This is my Clone", true).isPresent());
    }

}