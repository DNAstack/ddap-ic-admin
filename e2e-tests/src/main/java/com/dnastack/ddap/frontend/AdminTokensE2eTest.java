package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.tokensLink;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminTokensE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void shouldListTokens() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(tokensLink(), AdminListPage::new);

        adminListPage.assertListItemExists("fake-token");
    }

}
