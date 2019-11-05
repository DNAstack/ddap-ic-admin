package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.fragments.NavBar.icClientsLink;

@SuppressWarnings("Duplicates")
public class AdminIcClientsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addEmptyClient() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemDoNotExist("empty-client-label");

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "empty-client-id");
        adminManagePage.fillField(DdapBy.se("inp-clientId"), "cd26716c-b170-41f7-912e-0f72749c3e9a");
        adminManagePage.fillField(DdapBy.se("inp-label"), "empty-client-label");
        adminManagePage.fillField(DdapBy.se("inp-description"), "empty-client-desc");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("empty-client-label");
    }

    @Test
    public void addClient() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(icClientsLink());

        adminListPage.assertListItemDoNotExist("add-client-label");

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "add-client-id");
        adminManagePage.fillField(DdapBy.se("inp-clientId"), "cd26716c-b170-41f7-912e-0f72749c3e9a");
        adminManagePage.fillField(DdapBy.se("inp-label"), "add-client-label");
        adminManagePage.fillField(DdapBy.se("inp-description"), "add-client-desc");

        adminManagePage.enterButton(DdapBy.se("btn-add-redirect"));
        adminManagePage.toggleExpansionPanel("redirect-uri-0");
        adminManagePage.fillField(DdapBy.se("inp-redirect"), "https://test-source.com");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("add-client-label");
    }

    @Test
    public void editClient() {
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
