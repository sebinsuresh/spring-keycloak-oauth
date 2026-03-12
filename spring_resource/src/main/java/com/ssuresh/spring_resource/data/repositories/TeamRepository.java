package com.ssuresh.spring_resource.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssuresh.spring_resource.data.models.TeamEntity;

public interface TeamRepository extends JpaRepository<TeamEntity, String> {
}
