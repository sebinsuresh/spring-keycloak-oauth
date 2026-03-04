package com.ssuresh.spring_bff.configuration;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.HttpStatusAccessDeniedHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityFilter {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            ClientRegistrationRepository registrations) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/admin/**").hasRole("admin")
                        .requestMatchers("/user/**").hasRole("regular_user")
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        // Nbd but response content is inconsistent here -
                        // 401 sends empty body, 403 sends JSON/HTML white error page
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler(new HttpStatusAccessDeniedHandler(HttpStatus.FORBIDDEN)))
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost/", true))
                .logout(logout -> logout
                        .logoutRequestMatcher(PathPatternRequestMatcher
                                .withDefaults()
                                .matcher("/logout"))
                        .logoutSuccessHandler(oidcLogoutSuccessHandler(registrations)))
                .build();
    }

    @Bean
    public LogoutSuccessHandler oidcLogoutSuccessHandler(
            ClientRegistrationRepository registrations) {
        var handler = new OidcClientInitiatedLogoutSuccessHandler(registrations);
        handler.setPostLogoutRedirectUri("http://localhost/");
        return handler;
    }

    // There is no OIDC standard for where to put roles in the JWT yet.
    // Keycloak puts roles under realm_access field.
    // We need to tell Spring to find the roles in there manualy.
    @Bean
    public GrantedAuthoritiesMapper keyCloakUserRolesMapper() {
        return (Collection<? extends GrantedAuthority> authorities) -> {
            Set<GrantedAuthority> mappedAuthorities = new HashSet<>(authorities);

            authorities.forEach(authority -> {
                if (authority instanceof OidcUserAuthority oidcAuth) {
                    var realmAccessObj = oidcAuth.getAttributes().get("realm_access");
                    if (!(realmAccessObj instanceof Map<?, ?> realmMap)) {
                        return;
                    }

                    var rolesObj = realmMap.get("roles");
                    if (!(rolesObj instanceof Collection<?> rolesCollection)) {
                        return;
                    }

                    mappedAuthorities.addAll(rolesCollection.stream()
                            .filter(role -> role instanceof String)
                            .map(role -> "ROLE_" + role)
                            .map(SimpleGrantedAuthority::new).collect(Collectors.toList()));
                }
            });

            return mappedAuthorities;
        };
    }
}
