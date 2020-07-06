package com.dnastack.ddap.ic.account.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VisaJwt {

    private String sub;
    private Integer exp;
    @JsonProperty("ga4gh_visa_v1")
    private VisaBody visaBody;

    @Data
    public static class VisaBody {
        private String type;
        private String value;
        private String source;
        private String by;
        private Integer asserted;
    }

}
