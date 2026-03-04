package com.ssuresh.spring_bff.clients;

import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AdminClientImpl implements AdminClient {

    @Override
    public Map<String, String> getUserList() {
        // Let's pretend we got this data from some endpoint
        return Map.of(
                "testuser", "Test User",
                "testadmin", "Admin Test");
    }
}
