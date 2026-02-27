package com.ssuresh.spring_bff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @Autowired
    private final OAuth2AuthorizedClientService clientService = null;

    @GetMapping("/")
    public String hello() {
        return "Hello world";
    }

    @GetMapping("/secure")
    public String helloSecure(
            @AuthenticationPrincipal OidcUser user,
            Authentication authentication) {

        String s = "Hello %s<br />".formatted(user.getFullName());
        // s += "Your claims are %s<br />".formatted(user.getClaims().keySet());
        // s += "Your authorities are %s".formatted(user.getAuthorities());

        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                "keycloak",
                authentication.getName());
        var token = client.getAccessToken().getTokenValue();

        s += "The access token is: '%s'".formatted(token);

        return s;
    }
}
