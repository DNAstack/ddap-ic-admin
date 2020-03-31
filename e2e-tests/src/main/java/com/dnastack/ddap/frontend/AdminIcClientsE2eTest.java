package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Assume;
import org.junit.Test;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static com.dnastack.ddap.common.fragments.NavBar.icClientsLink;

@SuppressWarnings("Duplicates")
public class AdminIcClientsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addClient() {
        // FIXME: modify clients is only allowed on master realm
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 4, 20, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));

        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemDoNotExist("test-client-app-name");

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "test-client-app");
        adminManagePage.fillField(DdapBy.se("inp-label"), "test-client-app-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-scope"), "openid ga4gh_passport_v1 account_admin identities profile offline_access");

        adminManagePage.enterButton(DdapBy.se("btn-add-redirectUri"));
        adminManagePage.fillFieldFromTable(DdapBy.se("inp-redirectUris"), "http://localhost:8087");

        adminManagePage.enterButton(DdapBy.se("btn-add-grantType"));
        adminManagePage.fillFieldFromTable(DdapBy.se("inp-grantTypes"), "authorization_code");

        adminManagePage.enterButton(DdapBy.se("btn-add-responseType"));
        adminManagePage.fillFieldFromTable(DdapBy.se("inp-responseTypes"), "code");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-client-app-name");
    }

    @Test
    public void editClient() {
        // FIXME: modify clients is only allowed on master realm
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 4, 20, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));

        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemExists("edit-client-id");
        adminListPage.assertListItemDoNotExist("edited-client-id");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-client-id");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "edited-client-id");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-client-id");
        adminListPage.assertListItemExists("edited-client-id");
    }

    @Test
    public void deleteClient() {
        // FIXME: modify clients is only allowed on master realm
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 4, 20, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));

        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemExists("delete-client-id");

        AdminManagePage adminManagePage = adminListPage.clickView("delete-client-id");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete-client-id");
    }
}
