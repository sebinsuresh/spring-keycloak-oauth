package com.ssuresh.spring_bff.controllers;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> getMe(@AuthenticationPrincipal OidcUser user) {
        return Map.of(
                "name", user.getFullName(),
                "email", user.getEmail(),
                "claims", user.getClaims());
    }
}
