package com.techfix.controller;

import com.techfix.dto.response.EmployeesResponseDTO;
import com.techfix.exception.ForbiddenAccessException;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employees" )
public class EmployeeController {

    private UserService userService;

    public EmployeeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeesResponseDTO>> getAvaliableEmployees (@AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee){
            throw new ForbiddenAccessException("Acesso negado");
        }
        List<EmployeesResponseDTO> employees = userService.getAvailableEmployees(user);
        return ResponseEntity.ok(employees);
    }
}
