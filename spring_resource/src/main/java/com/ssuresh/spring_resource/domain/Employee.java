package com.ssuresh.spring_resource.domain;

import java.util.List;

public record Employee(
        String id,
        String oidcUserId,
        String name,
        List<String> roleNames,
        String teamName) {
}
