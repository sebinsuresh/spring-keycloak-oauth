package com.ssuresh.spring_bff.clients;

import java.util.Collection;

import com.ssuresh.spring_bff.clients.models.UserInformation;

public interface AdminClient {

    public Collection<UserInformation> getUserList();
}
