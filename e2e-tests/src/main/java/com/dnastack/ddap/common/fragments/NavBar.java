package com.dnastack.ddap.common.fragments;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminOptionPage;
import com.dnastack.ddap.common.page.ICLoginPage;
import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.util.WebPageScroller;
import lombok.Value;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

public class NavBar {

    private WebDriver driver;

    @Value
    public static class NavLink {
        private String title;
        private By selector;
        private NavLink parentSelector;

        public Optional<NavLink> getParentSelector() {
            return Optional.ofNullable(parentSelector);
        }
        public Optional<String> getTitle() {
            return Optional.ofNullable(title);
        }
    }

    public static NavLink identityManagementPanelSelectorLink() {
        return new NavLink("Identity Management", DdapBy.se("nav-group-identity-admin"), null);
    }

    public static NavLink tokensLink() {
        return new NavLink("Sessions", DdapBy.se("nav-sessions"), identityManagementPanelSelectorLink());
    }

    public static NavLink consentsLink() {
        return new NavLink("Consents", DdapBy.se("nav-consents"), identityManagementPanelSelectorLink());
    }

    public static NavLink auditlogsLink() {
        return new NavLink("Auditlogs", DdapBy.se("nav-auditlogs"), identityManagementPanelSelectorLink());
    }

    public static NavLink icPanelSelectorLink() {
        return new NavLink("Identity Concentrator", DdapBy.se("nav-group-ic-admin"), null);
    }

    public static NavLink icIdentityProvidersLink() {
        return new NavLink("Identity Providers", DdapBy.se("nav-ic-admin-identity-providers"), icPanelSelectorLink());
    }

    public static NavLink icClientsLink() {
        return new NavLink("Clients", DdapBy.se("nav-ic-admin-clients"), icPanelSelectorLink());
    }

    public static NavLink icOptionsLink() {
        return new NavLink("Options", DdapBy.se("nav-ic-admin-options"), icPanelSelectorLink());
    }

    public static NavLink userAdministrationPanelSelectorLink() {
        return new NavLink("User Administration", DdapBy.se("nav-group-user-admin"), null);
    }

    public static NavLink usersLink() {

        return new NavLink("Users", DdapBy.se("nav-admin-users"), userAdministrationPanelSelectorLink());
    }

    public static NavLink identityLink() {
        return new NavLink("Identity", DdapBy.se("nav-my-identity"), null);
    }

    public NavBar(WebDriver driver) {
        this.driver = driver;
    }

    public void assertAdminNavBar() {
        Stream.of(icPanelSelectorLink().getSelector())
              .forEach(this.driver::findElement);
    }

    public void assertNonAdminNavBar() {
        Stream.of(identityManagementPanelSelectorLink().getSelector())
                .forEach(this.driver::findElement);
    }

    public boolean existsInNavBar(NavLink item) {
        return driver.findElements(item.getSelector()).size() > 0;
    }

    public NavBar goTo(NavLink navItem) {
        return goTo(navItem, NavBar::new);
    }

    public <T> T goTo(NavLink navItem, Function<WebDriver, T> pageFactory) {
        final WebElement clickableNavLink = navItem.getParentSelector()
                                                   .map(parent -> getChildLink(navItem, parent))
                                                   .orElseGet(() -> driver.findElement(navItem.getSelector()));
        clickableNavLink.click();

        return pageFactory.apply(driver);
    }

    private WebElement getChildLink(NavLink navItem, NavLink parent) {
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(parent.getSelector()));
        final WebElement parentElement = driver.findElement(parent.getSelector());
        parentElement.click();
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(parentElement.findElement(navItem.getSelector())));

        return parentElement.findElement(navItem.getSelector());
    }

    public AdminListPage goToAdmin(NavLink navItem) {
        return goTo(navItem, AdminListPage::new);
    }

    public AdminOptionPage goToAdminOptionPage(NavLink navItem) {
        return goTo(navItem, AdminOptionPage::new);
    }

    private WebElement getRealmInput() {
        return driver.findElement(DdapBy.se("realm-input"));
    }

    public void setRealmAndCancel(String targetRealm) {
        WebElement realmMenu = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(driver.findElement(DdapBy.se("realm-menu"))));
        WebPageScroller.scrollTo(driver, realmMenu);
        realmMenu.click();
        WebElement editRealmBtn = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(driver.findElement(DdapBy.se("edit-realm"))));
        WebPageScroller.scrollTo(driver, editRealmBtn);
        editRealmBtn.click();
        WebElement realmInput = getRealmInput();
        realmInput.clear();
        realmInput.sendKeys(targetRealm);
        driver.findElement(DdapBy.se("cancel-realm-change")).click();
    }

    public String getRealm() {
        WebElement realmInput = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("realm-name")));
        return realmInput.getText();
    }

    public ICLoginPage logOut() {
        openProfileMenu();
        WebElement logoutBtn = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(DdapBy.se("nav-logout")));
        logoutBtn.click();
        return new ICLoginPage(driver);
    }

    public void openProfileMenu() {
        WebElement menuProfileBtn = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(DdapBy.se("menu-profile-btn")));
        menuProfileBtn.click();
    }
}
