package com.ssuresh.spring_resource.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssuresh.spring_resource.data.models.EmployeeEntity;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, String> {

    public EmployeeEntity findByOidcUserId(String oidcUserId);

    public List<EmployeeEntity> findAllByTeamId(String teamId);
}
