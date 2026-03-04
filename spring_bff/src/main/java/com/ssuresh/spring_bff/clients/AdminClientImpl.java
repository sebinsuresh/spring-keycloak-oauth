package com.ssuresh.spring_bff.clients;

import java.util.Collection;
import java.util.List;
import org.springframework.stereotype.Service;

import com.ssuresh.spring_bff.clients.models.UserInformation;

@Service
public class AdminClientImpl implements AdminClient {

    @Override
    public Collection<UserInformation> getUserList() {
        // Let's pretend we got this data from some data source
        return List.of(
                new UserInformation("testuser", "Test User"),
                new UserInformation("testadmin", "Admin Test"));
    }
}
