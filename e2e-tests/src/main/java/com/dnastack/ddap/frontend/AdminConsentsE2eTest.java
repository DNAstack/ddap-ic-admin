package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assume;
import org.junit.BeforeClass;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.consentsLink;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminConsentsE2eTest extends AbstractAdminFrontendE2eTest {

    @BeforeClass
    public static void beforeClass() throws Exception {
        Assume.assumeFalse(
            "IC consent is disabled, skipping consents' e2e tests",
            Boolean.parseBoolean(optionalEnv("E2E_WALLET_SKIP_IC_CONSENT","false"))
        );
    }

    @Test
    public void shouldListConsents() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(consentsLink(), AdminListPage::new);

        adminListPage.assertTableNotEmpty();
    }

}
