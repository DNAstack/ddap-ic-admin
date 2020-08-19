package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminOptionPage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.icOptionsLink;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;

@SuppressWarnings("Duplicates")
public class AdminIcOptionsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void submitBooleanOptionWithoutTypeError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
                                                .goToAdminOptionPage(icOptionsLink());

        assertThat(adminListPage.getOptionNames(), hasItem("Read Only Master Realm"));
        final String oldValue = adminListPage.getOptionValue("Read Only Master Realm");
        adminListPage.submitOption("Read Only Master Realm", "readOnlyMasterRealm", oldValue);
        adminListPage.assertNoError(5);
    }

    @Test
    public void submitStringOptionWithoutTypeError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
                                                .goToAdminOptionPage(icOptionsLink());

        assertThat(adminListPage.getOptionNames(), hasItem("Claim TTL Cap"));
        final String oldValue = adminListPage.getOptionValue("Claim TTL Cap");
        adminListPage.submitOption("Claim TTL Cap", "claimTtlCap", oldValue);
        adminListPage.assertNoError(5);
    }

    @Test
    public void submitOptionWithError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
            .goToAdminOptionPage(icOptionsLink());

        assertThat(adminListPage.getOptionNames(), hasItem("Claim TTL Cap"));
        final String oldValue = adminListPage.getOptionValue("Claim TTL Cap");
        adminListPage.submitOption("Claim TTL Cap", "claimTtlCap", "invalid-value");
        adminListPage.assertHasError(5);
    }

}
