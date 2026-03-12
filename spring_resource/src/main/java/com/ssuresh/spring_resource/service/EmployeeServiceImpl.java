package com.ssuresh.spring_resource.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssuresh.spring_resource.data.models.EmployeeEntity;
import com.ssuresh.spring_resource.data.models.TeamEntity;
import com.ssuresh.spring_resource.data.repositories.EmployeeRepository;
import com.ssuresh.spring_resource.domain.Employee;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repo;

    @Override
    @Transactional(readOnly = true)
    public Employee getEmployeeByOidcId(String oidcId) {
        var entity = repo.findByOidcUserId(oidcId);
        return mappedToDomain(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByTeam(String teamId) {
        List<EmployeeEntity> employees = this.repo.findAllByTeamId(teamId);
        return employees.stream().map(this::mappedToDomain).collect(Collectors.toList());
    }

    private Employee mappedToDomain(EmployeeEntity entity) {
        return new Employee(
                entity.getId(),
                entity.getOidcUserId(),
                entity.getName(),
                entity.getRoles()
                        .stream()
                        .map(Enum::toString)
                        .collect(Collectors.toList()),
                Optional.ofNullable(entity.getTeam())
                        .map(TeamEntity::getTeamName)
                        .orElse(null));
    }
}
