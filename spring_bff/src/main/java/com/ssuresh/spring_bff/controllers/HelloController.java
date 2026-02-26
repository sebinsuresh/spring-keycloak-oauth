package com.ssuresh.spring_bff.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello world";
    }

    @GetMapping("/secure")
    public String helloSecure() {
        return "Hello secure world";
    }
}
