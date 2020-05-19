package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdminListPage extends AdminDdapPage {

    public AdminListPage(WebDriver driver) {
        super(driver);
    }

    public AdminManagePage clickManage() {
        driver.findElement(DdapBy.se("btn-manage"))
                .click();
        return new AdminManagePage(driver);
    }

    public AdminManagePage clickView(String resourceName) {
        driver.findElement(DdapBy.seAndText("entity-title", resourceName))
            .click();
        return new AdminManagePage(driver);
    }

    public void assertListItemExists(String title) {
        new WebDriverWait(driver, 2)
                .until(ExpectedConditions.visibilityOfAllElementsLocatedBy(DdapBy.seAndText("entity-title", title)));
    }

    public void assertListItemDoNotExist(String title) {
        new WebDriverWait(driver, 2)
                .until(ExpectedConditions.invisibilityOfElementLocated(DdapBy.seAndText("entity-title", title)));
    }

    public void assertTableNotEmpty() {
        new WebDriverWait(driver, 5)
            .until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector(".mat-row"), 0));
    }

}
