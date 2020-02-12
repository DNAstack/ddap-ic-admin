package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.consentsLink;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminConsentsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void shouldListConsents() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(consentsLink(), AdminListPage::new);

        adminListPage.assertListItemExists("consents/fake-consent");
    }

}
