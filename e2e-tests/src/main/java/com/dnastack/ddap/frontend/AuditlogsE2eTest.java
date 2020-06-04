package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import static com.dnastack.ddap.common.fragments.NavBar.auditlogsLink;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SuppressWarnings("Duplicates")
public class AuditlogsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void verifyAuditlogs() {
        AdminListPage adminListPage = ddapPage.getNavBar().goTo(auditlogsLink(), AdminListPage::new);
        driver.navigate().refresh();
        adminListPage.assertTableNotEmpty();
        String pageSize = driver.findElement(DdapBy.se("page-size")).getText();
        WebElement auditlogsTable = driver.findElement(DdapBy.se("auditlog-result"));
        assertThat("Auditlogs size", auditlogsTable.findElements(By.tagName("tr")).size(),
                allOf(greaterThan(1), lessThanOrEqualTo(Integer.parseInt(pageSize) + 1)));

        WebElement auditlog = auditlogsTable.findElements(By.tagName("tr")).get(2);
        String auditlogId = auditlog.findElements(By.tagName("td")).get(0).getText();
        auditlog.click();
        adminListPage.waitForInflightRequests();

        assertThat("Auditlogs detail page", driver.findElement(DdapBy.se("name")).getText(),
                containsString(auditlogId));
    }
}
