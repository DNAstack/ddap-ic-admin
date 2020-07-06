package com.dnastack.ddap.ic.account.service;

import com.dnastack.ddap.common.config.ProfileService;
import com.dnastack.ddap.common.security.UserTokenCookiePackager;
import com.dnastack.ddap.ic.account.client.IcUserInfo;
import com.dnastack.ddap.ic.account.client.ReactiveIcAccountClient;
import com.dnastack.ddap.ic.account.model.Account;
import com.dnastack.ddap.ic.account.model.IdentityModel;
import com.dnastack.ddap.ic.account.model.VisaJwt;
import com.dnastack.ddap.ic.account.model.UserInfo;
import com.dnastack.ddap.ic.common.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Mono;
import scim.v2.Users;

import java.util.*;
import java.util.stream.Collectors;

import static com.dnastack.ddap.common.security.UserTokenCookiePackager.BasicServices.IC;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Primary
public class IcUserInfoIdentityService implements IdentityService {
    private final ReactiveIcAccountClient icAccountClient;
    private final UserTokenCookiePackager cookiePackager;
    private final ProfileService profileService;

    @Override
    public Mono<IdentityModel> getIdentity(ServerHttpRequest request, @PathVariable String realm) {
        final UserTokenCookiePackager.CookieValue token = cookiePackager.extractRequiredToken(request, IC.cookieName(UserTokenCookiePackager.TokenKind.ACCESS));

        final Mono<IcUserInfo> userInfoMono = icAccountClient.getUserInfo(token.getClearText());
        final Mono<Users.User> scimMono = icAccountClient.getAccounts(realm, token, null);

        return Mono.zip(userInfoMono, scimMono)
            .map(tuple -> {
                final IcUserInfo userInfo = tuple.getT1();
                final Users.User scim = tuple.getT2();
                final JwtUtil.JwtSubject subject = JwtUtil.dangerousStopgapExtractSubject(token.getClearText()).get();

                // TODO this code would break if two IDPs gave a user the same sub
                final Map<String, List<VisaJwt>> visasBySub = userInfo.getPassports()
                    .stream()
                    .flatMap(jws -> JwtUtil.dangerousStopgapExtractClaims(jws, VisaJwt.class).stream())
                    .filter(visa -> !Objects.equals(visa.getSub(), subject.getSub()))
                    .collect(groupingBy(VisaJwt::getSub, toList()));
                final Map<String, String> emailsBySub = scim.getEmailsList()
                    .stream()
                    .map(attr -> Map.entry(attr.getRef().split("/", 3)[2], attr.getValue()))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

                final Map<String, String> providerBySub = scim.getEmailsList()
                    .stream()
                    .map(attr -> Map.entry(attr.getRef().split("/", 3)[2], attr.getRef().split("/", 3)[1]))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

                final Optional<String> primaryEmail = scim.getEmailsList()
                    .stream()
                    .filter(Users.Attribute::getPrimary)
                    .map(Users.Attribute::getValue)
                    .findFirst();
                final String primaryPhoto = Optional.ofNullable(scim.getPhotosList())
                    .orElse(List.of())
                    .stream()
                    .filter(Users.Attribute::getPrimary)
                    .map(Users.Attribute::getValue)
                    .findFirst()
                    .orElseGet(() -> {
                        // If there is no primary photo, get first
                        if (scim.getPhotosList() != null && scim.getPhotosList().size() > 0) {
                            return scim.getPhotosList().get(0).getValue();
                        } else {
                            return null;
                        }
                    });

                final List<Account> connectedAccounts =
                    emailsBySub.entrySet()
                        .stream()
                        .filter(e -> e.getValue() != null && !e.getValue().isEmpty())
                        .map(e -> {
                            final String sub = e.getKey();
                            final String email = e.getValue();
                            final List<VisaJwt> jwts = Optional.ofNullable(visasBySub.get(sub))
                                .orElse(List.of());
                            final List<Account.FlatVisa> visas =
                                jwts.stream()
                                    .map(jwt -> {
                                        final VisaJwt.VisaBody visaBody = jwt.getVisaBody();
                                        return new Account.FlatVisa(visaBody.getType(),
                                            visaBody.getValue(),
                                            visaBody.getSource(),
                                            visaBody.getBy(),
                                            visaBody.getAsserted(),
                                            jwt.getExp());
                                    })
                                    .collect(toList());
                            final boolean isPrimaryEmail = primaryEmail.filter(pe -> pe.equals(email)).isPresent();
                            final String provider = providerBySub.get(sub);
                            final String loginHint = provider + ":" + sub;

                            return new Account(sub, provider, email, isPrimaryEmail, loginHint, primaryPhoto, visas);
                        })
                        .collect(toList());
                final UserInfo userInfoDto = new UserInfo(subject.getSub(), scim, connectedAccounts);

                return IdentityModel.builder()
                    .account(userInfoDto)
                    .scopes(Optional.ofNullable(subject.getScp()).orElse(Collections.emptyList()))
                    .sandbox(profileService.isSandboxProfileActive())
                    .build();
            });
    }
}
