package com.ssuresh.spring_resource.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssuresh.spring_resource.domain.Employee;
import com.ssuresh.spring_resource.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService service;

    @GetMapping("/list")
    public List<Employee> getEmployeesForTeam(@RequestParam String teamId) {
        return service.getEmployeesByTeam(teamId);
    }

    @GetMapping("/employeeId")
    public Employee getEmployeeId(@RequestParam String oidcUserId) {
        return service.getEmployeeByOidcId(oidcUserId);
    }
}
