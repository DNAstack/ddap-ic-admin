package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

public class IdentityPage extends AnyDdapPage {

    public IdentityPage(WebDriver driver) {
        super(driver);
        driver.findElement(DdapBy.seAndText("page-title", "My Identity"));
    }

    public List<String> getLinkableIdentities() {
        return getDriver().findElement(By.className("ddap-available-accounts"))
            .findElements(By.tagName("mat-card-subtitle")).stream()
            .map(WebElement::getText)
            .collect(Collectors.toList());
    }

    public List<String> getLinkedIdentities() {
        return getDriver().findElement(By.className("ddap-connected-accounts"))
            .findElements(By.tagName("mat-card-subtitle")).stream()
            .map(WebElement::getText)
            .collect(Collectors.toList());
    }

}
