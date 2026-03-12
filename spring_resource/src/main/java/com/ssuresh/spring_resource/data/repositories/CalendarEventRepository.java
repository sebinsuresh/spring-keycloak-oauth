package com.ssuresh.spring_resource.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssuresh.spring_resource.data.models.CalendarEventEntity;

public interface CalendarEventRepository extends JpaRepository<CalendarEventEntity, String> {

    public List<CalendarEventEntity> findByCreatorId(String creatorId);
}
