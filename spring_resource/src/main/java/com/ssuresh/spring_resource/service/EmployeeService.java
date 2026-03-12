package com.ssuresh.spring_resource.service;

import java.util.List;

import com.ssuresh.spring_resource.domain.Employee;

public interface EmployeeService {

    Employee getEmployeeByOidcId(String oidcId);
    
    List<Employee> getEmployeesByTeam(String teamId);
}
