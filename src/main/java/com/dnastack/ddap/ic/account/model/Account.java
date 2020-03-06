package com.dnastack.ddap.ic.account.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    private String sub;
    private String provider;
    private String email;
    private boolean primary;
    private String loginHint;
    private String photoUrl;
    private List<FlatVisa> passport;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlatVisa {
        private String type;
        private String value;
        private String source;
        private String by;
        private Integer asserted;
        private Integer exp;
    }
}
