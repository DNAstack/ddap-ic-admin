package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import org.junit.Assume;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;

@SuppressWarnings("Duplicates")
public class RealmDeleteE2eTest extends AbstractFrontendE2eTest {

    private static final String REALM = generateRealmName(RealmDeleteE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        boolean isSandbox = Boolean.parseBoolean(optionalEnv("E2E_SANDBOX", "false"));
        Assume.assumeTrue(isSandbox);
        String icConfig = loadTemplate("/com/dnastack/ddap/icAdminConfig.json");
        setupIcConfig(TestingPersona.ADMINISTRATOR, icConfig, REALM);

        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);
    }


    // It easier to have separated class for testing deletion, since we have fresh realm to delete while keeping isolation
    // for other tests
    @Test
    @Ignore // FIXME: ignored until DISCO-2891 fixed
    public void testRealmDeletion() {
        String otherRealm = "test_other_realm_" + System.currentTimeMillis();
        assertThat("this test is pointless unless we start on a different realm than we're going to!",
            ddapPage.getNavBar().getRealm(), is(not(otherRealm)));

        // User should get redirected to "master" realm
        ddapPage.getNavBar().deleteCurrentRealm();

        // Wrap this with large timeout because redirect to IC and back happens here
        new WebDriverWait(driver, 30)
            .ignoring(AssertionError.class)
            .until(d -> {
                assertThat(ddapPage.getNavBar().getRealm(), is("master"));
                return true;
            });
    }

}
