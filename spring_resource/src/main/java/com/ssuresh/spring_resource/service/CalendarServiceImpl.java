package com.ssuresh.spring_resource.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssuresh.spring_resource.data.models.CalendarEventEntity;
import com.ssuresh.spring_resource.data.models.EmployeeEntity;
import com.ssuresh.spring_resource.data.repositories.CalendarEventRepository;
import com.ssuresh.spring_resource.data.repositories.EmployeeRepository;
import com.ssuresh.spring_resource.domain.CalendarEvent;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CalendarServiceImpl implements CalendarService {

    private final CalendarEventRepository repo;
    private final EmployeeRepository employeeRepo;

    @Override
    public List<CalendarEvent> getEventsForUser(String userId) {
        var eventEntities = repo.findByCreatorId(userId);
        return eventEntities.stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean crateEvent(CalendarEvent event, String oidcUserId) {
        var userEntity = employeeRepo.findByOidcUserId(oidcUserId);
        var entity = this.mapToEntity(event, userEntity);
        var created = repo.save(entity);
        return created != null;
    }

    private CalendarEvent mapToDomain(CalendarEventEntity entity) {
        return new CalendarEvent(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getPrivateNotes(),
                entity.getStartTime(),
                entity.getEndTime(),
                entity.getType());
    }

    private CalendarEventEntity mapToEntity(
            CalendarEvent domain, EmployeeEntity employee) {
        return new CalendarEventEntity(
                null,
                domain.title(),
                domain.description(),
                domain.privateNotes(),
                domain.startTime(),
                domain.endTime(),
                domain.type(),
                employee);
    }
}
