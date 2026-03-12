package com.ssuresh.spring_resource.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssuresh.spring_resource.data.models.CalendarEventEntity;
import com.ssuresh.spring_resource.data.repositories.CalendarEventRepository;

@RestController
@RequestMapping("/events")
public class CalendarEventController {

    // TODO: models for api &/ svc layer

    // TODO: implement these

    private final CalendarEventRepository repo;

    public CalendarEventController(CalendarEventRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/list/self")
    public List<CalendarEventEntity> getEventsForSelf() {
        return null;
    }

    @GetMapping("/list")
    public List<CalendarEventEntity> getEventsForUser(@RequestParam String userId) {
        return repo.findByCreatorId(userId);
    }

    @PostMapping("/create")
    public String createEvent(@RequestBody CalendarEventEntity event) {
        return null;
    }
}
