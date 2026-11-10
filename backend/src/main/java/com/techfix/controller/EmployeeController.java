package com.techfix.controller;

import com.techfix.dto.request.UpdateEmployeeRequestDTO;
import com.techfix.dto.response.EmployeeDetailsResponseDTO;
import com.techfix.dto.response.EmployeeResponseDTO;
import com.techfix.dto.response.EmployeesResponseDTO;
import com.techfix.exception.ForbiddenAccessException;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/all")
    public ResponseEntity<List<EmployeeResponseDTO>> listEmployees (@AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee){
            throw new ForbiddenAccessException("Acesso negado");
        }
        return ResponseEntity.ok(userService.listEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDetailsResponseDTO> getEmployee (@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user.getRole() != UserRole.employee){
            throw new ForbiddenAccessException("Acesso negado");
        }
        return ResponseEntity.ok(userService.getEmployee(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDetailsResponseDTO> updateEmployee (@AuthenticationPrincipal User user, @PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequestDTO request) {
        if (user.getRole() != UserRole.employee){
            throw new ForbiddenAccessException("Acesso negado");
        }
        return ResponseEntity.ok(userService.updateEmployee(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee (@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user.getRole() != UserRole.employee){
            throw new ForbiddenAccessException("Acesso negado");
        }
        userService.deleteEmployee(id, user);
        return ResponseEntity.noContent().build();
    }
}
