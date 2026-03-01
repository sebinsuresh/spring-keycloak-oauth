package com.ssuresh.spring_bff.controllers;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class UserController {

    @GetMapping("/api/me")
    public Map<String, Object> getMe(@AuthenticationPrincipal OidcUser user) {
        // TODO: implement proper solution:
        // This is a workaround for auth & cors related issue: allow requests to
        // /api/me, but return null if not authenticated.
        if (user == null) {
            return null;
        }

        return Map.of(
                "name", user.getFullName(),
                "email", user.getEmail(),
                "claims", user.getClaims());
    }
}
