package com.ssuresh.spring_resource.domain;

import java.time.Instant;

import com.ssuresh.spring_resource.data.models.CalendarEventType;

public record CalendarEvent(
        String id,
        String title,
        String description,
        String privateNotes,
        Instant startTime,
        Instant endTime,
        CalendarEventType type) {
}
