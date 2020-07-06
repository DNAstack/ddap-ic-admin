package com.dnastack.ddap.ic.account.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import scim.v2.Users;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

    private String sub;
    private Users.User scim;
    private List<Account> connectedAccounts;

}
