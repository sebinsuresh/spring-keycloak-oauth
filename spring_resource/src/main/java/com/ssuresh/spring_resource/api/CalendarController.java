package com.ssuresh.spring_resource.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ssuresh.spring_resource.domain.CalendarEvent;
import com.ssuresh.spring_resource.service.CalendarService;
import com.ssuresh.spring_resource.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private final CalendarService service;
    private final EmployeeService employeeService;

    @GetMapping("/list/self")
    public List<CalendarEvent> getEventsForSelf(
            @AuthenticationPrincipal OidcUser user) {

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        var oidcId = user.getAttribute("sub");
        if (oidcId == null || !(oidcId instanceof String)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "OIDC User sub not found");
        }

        var userId = employeeService.getUserIdByOidcId((String) oidcId);
        return service.getEventsForUser(userId);
    }

    @GetMapping("/list")
    public List<CalendarEvent> getEventsForUser(@RequestParam String userId) {
        return service.getEventsForUser(userId);
    }

    @PostMapping("/create")
    public boolean createEvent(
            @RequestBody CalendarEvent event,
            @AuthenticationPrincipal OidcUser user) {

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        var oidcId = user.getAttribute("sub");
        if (oidcId == null || !(oidcId instanceof String)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "OIDC User sub not found");
        }
        return service.crateEvent(event, (String) oidcId);
    }
}
