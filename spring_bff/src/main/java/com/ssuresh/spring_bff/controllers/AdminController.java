package com.ssuresh.spring_bff.controllers;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssuresh.spring_bff.clients.AdminClient;
import com.ssuresh.spring_bff.clients.models.UserInformation;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private final AdminClient adminClient;

    public AdminController(AdminClient adminClient) {
        this.adminClient = adminClient;
    }

    @GetMapping("/listusers")
    public Collection<UserInformation> getUserList() {
        return adminClient.getUserList();
    }
}
