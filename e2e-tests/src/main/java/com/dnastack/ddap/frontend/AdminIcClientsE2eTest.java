package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Assume;
import org.junit.Test;

import java.time.Instant;

import static com.dnastack.ddap.common.fragments.NavBar.icClientsLink;

@SuppressWarnings("Duplicates")
public class AdminIcClientsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addClient() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemDoNotExist("test-client-app-name");

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "test-client-app");
        adminManagePage.fillField(DdapBy.se("inp-label"), "test-client-app-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-scope"), "openid ga4gh_passport_v1 account_admin identities profile offline_access");

        adminManagePage.enterButton(DdapBy.se("btn-add-grantType"));
        adminManagePage.fillField(DdapBy.se("inp-grantType"), "authorization_code");

        adminManagePage.enterButton(DdapBy.se("btn-add-responseType"));
        adminManagePage.fillField(DdapBy.se("inp-responseType"), "code");

        adminManagePage.enterButton(DdapBy.se("btn-add-redirectUri"));
        adminManagePage.fillField(DdapBy.se("inp-redirectUri"), "http://localhost:8087");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-client-app-name");
    }

    @Test
    public void editClient() {
        // DAM functionality for PUT is broken, ignoring until sorted out
        Assume.assumeTrue(Instant.now().isAfter(Instant.ofEpochSecond(1581125077))); // Feb 7, 2020

        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemExists("edit-client-id");
        adminListPage.assertListItemDoNotExist("edited-client-id");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-client-id", "Edit");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "edited-client-id");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-client-id");
        adminListPage.assertListItemExists("edited-client-id");
    }

    @Test
    public void deleteClient() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemExists("delete-client-id");

        AdminManagePage adminManagePage = adminListPage.clickView("delete-client-id", "Edit");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete-client-id");
    }
}
