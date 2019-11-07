package com.dnastack.ddap.common.fragments;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminOptionPage;
import com.dnastack.ddap.common.page.ICLoginPage;
import com.dnastack.ddap.common.util.DdapBy;
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

    public static NavLink damIdentityLink() {
        return new NavLink("My Identity", DdapBy.se("nav-identity"), null);
    }

    public static NavLink icPanelSelectorLink() {
        return new NavLink("Identity Concentrator", DdapBy.se("nav-ic-panel"), null);
    }

    public static NavLink icIdentityProvidersLink() {
        return new NavLink("Identity Providers", DdapBy.se("nav-ic-identity-providers"), icPanelSelectorLink());
    }

    public static NavLink icClientsLink() {
        return new NavLink("Clients", DdapBy.se("nav-ic-clients"), icPanelSelectorLink());
    }

    public static NavLink icOptionsLink() {
        return new NavLink("Options", DdapBy.se("nav-ic-options"), icPanelSelectorLink());
    }

    public NavBar(WebDriver driver) {
        this.driver = driver;
    }

    public void assertAdminNavBar() {
        Stream.of(icPanelSelectorLink().getSelector())
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

    public ConfirmationRealmChangeDialog setRealm(String targetRealm) {
        WebElement realmInput = getRealmInput();

        realmInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.BACK_SPACE);
        realmInput.sendKeys(targetRealm, Keys.RETURN);

        return new ConfirmationRealmChangeDialog(driver);
    }

    public String getRealm() {
        WebElement realmInput = getRealmInput();
        return realmInput.getAttribute("value");
    }

    public ICLoginPage logOut() {
        driver.findElement(DdapBy.se("nav-logout")).click();
        return new ICLoginPage(driver);
    }

}
