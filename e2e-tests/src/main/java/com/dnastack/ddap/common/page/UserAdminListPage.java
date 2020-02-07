package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.Optional;

import static java.lang.String.format;

@Slf4j
public class UserAdminListPage extends AnyDdapPage {

    public UserAdminListPage(WebDriver driver) {
        super(driver);
    }

    public void setActiveUsersOnly() {
        WebElement radioActiveOnly = driver.findElement(DdapBy.se("radio-active-users-only"));
        new WebDriverWait(driver, 2)
            .until(ExpectedConditions.elementToBeClickable(radioActiveOnly));
        radioActiveOnly.click();
        waitForInflightRequests();
    }

    public Optional<WebElement> getFirstUserByNameAndActivity(String title, boolean enabled) {
        new WebDriverWait(driver, 2)
            .until(ExpectedConditions.visibilityOfAllElementsLocatedBy(DdapBy.seAndText("user-name", title)));
        List<WebElement> userExpansionPanels = driver.findElements(getLine(title));
        return userExpansionPanels.stream()
            .filter((element) -> {
                String description = element.findElement(By.tagName("mat-panel-description")).getText();
                return description.equalsIgnoreCase(enabled ? "active" : "inactive");
            })
            .findFirst();
    }

    public AnyDdapPage closeAccount(WebElement userExpansionPanel) {
        userExpansionPanel.click();

        WebElement closeAccountButton = userExpansionPanel.findElement(DdapBy.se("btn-close-user-account"));
        new WebDriverWait(driver, 5).until(d -> closeAccountButton.isDisplayed());
        closeAccountButton.click();

        WebElement closeAccountDialogConfirmationButton = driver.findElement(DdapBy.se("accept-btn"));
        new WebDriverWait(driver, 5).until(d -> closeAccountDialogConfirmationButton.isDisplayed());
        closeAccountDialogConfirmationButton.click();

        this.waitForInflightRequests();
        return new AnyDdapPage(driver);
    }

    public UserAdminManagePage editAccount(WebElement userExpansionPanel) {
        userExpansionPanel.click();

        WebElement editAccountButton = userExpansionPanel.findElement(DdapBy.se("btn-edit-user"));
        new WebDriverWait(driver, 5).until(d -> editAccountButton.isDisplayed());
        editAccountButton.click();

        this.waitForInflightRequests();
        return new UserAdminManagePage(driver);
    }

    private By getLine(String user) {
        return By.xpath(format("//mat-expansion-panel[descendant::*[contains(text(), '%s') and @data-se='user-name']]",
            user
        ));
    }

    private By getButton(String buttonText) {
        return By.xpath(format("//button[descendant::*[contains(text(), '%s')]]",
            buttonText
        ));
    }

}
