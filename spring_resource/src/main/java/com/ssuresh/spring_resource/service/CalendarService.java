package com.ssuresh.spring_resource.service;

import java.util.List;

import com.ssuresh.spring_resource.domain.CalendarEvent;

public interface CalendarService {

    List<CalendarEvent> getEventsForUser(String userId);

    boolean crateEvent(CalendarEvent event, String oidcUserId);
}
