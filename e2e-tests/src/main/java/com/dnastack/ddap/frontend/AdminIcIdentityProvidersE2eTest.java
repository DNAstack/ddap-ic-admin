package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.icIdentityProvidersLink;

@SuppressWarnings("Duplicates")
public class AdminIcIdentityProvidersE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addIdentityProvider() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icIdentityProvidersLink());

        adminListPage.assertListItemDoNotExist("add-ip-label");

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "add-ip-label");
        adminManagePage.fillField(DdapBy.se("inp-description"), "add-ip-desc");

        adminManagePage.fillField(DdapBy.se("inp-clientId"), "cd26716c-b170-41f7-912e-0f72749c3e9a");
        adminManagePage.fillField(DdapBy.se("inp-clientSecret"), "cd26716c-b170-41f7-912e-0f72749c3e9a");
        adminManagePage.fillField(DdapBy.se("inp-issuer"), "https://foo.bar.example.com/oidc");
        adminManagePage.fillField(DdapBy.se("inp-tokenUrl"), "https://foo.bar.example.com/oidc/token");
        adminManagePage.fillField(DdapBy.se("inp-authorizeUrl"), "https://foo.bar.example.com/oidc/authorize");
        adminManagePage.fillField(DdapBy.se("inp-responseType"), "id_token access_token refresh_token");
        // Temporarily remove as allowable values vary between staging and prod
//        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-translateUsing"), "dbGaP Passport Translator");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("add-ip-label");
    }

    @Test
    public void editIdentityProvider() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icIdentityProvidersLink());

        adminListPage.assertListItemExists("edit-ip-id");
        adminListPage.assertListItemDoNotExist("edited-ip-id");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-ip-id");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "edited-ip-id");
        adminManagePage.fillField(DdapBy.se("inp-clientId"), "cd26716c-b170-41f7-912e-0f72749c3e9a");
        adminManagePage.fillField(DdapBy.se("inp-clientSecret"), "cd26716c-b170-41f7-912e-0f72749c3e9a");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-ip-id");
        adminListPage.assertListItemExists("edited-ip-id");
    }

    @Test
    public void deleteIdentityProvider() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icIdentityProvidersLink());

        adminListPage.assertListItemExists("delete-ip-id");

        AdminManagePage adminManagePage = adminListPage.clickView("delete-ip-id");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete-ip-id");
    }

    @Test
    public void deleteFromListPolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(icIdentityProvidersLink());
        String entityToBeDeleted = "delete-ip-list";

        adminListPage.assertListItemExists(entityToBeDeleted);

        adminListPage = adminListPage.clickDelete(entityToBeDeleted);

        adminListPage.assertListItemDoNotExist(entityToBeDeleted);
    }

}
