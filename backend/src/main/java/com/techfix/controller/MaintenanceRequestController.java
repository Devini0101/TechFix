package com.techfix.controller;

import com.techfix.dto.request.BudgetAnswerRequestDTO;
import com.techfix.dto.request.BudgetRequestDTO;
import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.exception.ForbiddenAccessException;
import com.techfix.exception.UpdateInvalidMaintenanceBudgetException;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-request")
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(
            @Valid @RequestBody MaintenanceRequestDTO request,
            Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        service.create(request, client);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/summary")
    public MaintenanceSummaryResponseDTO getMaintenanceSummary(Authentication authentication) {
        User client = (User) authentication.getPrincipal();

        if (client.getRole().equals(UserRole.employee)) {
            return service.getMaintenancesSummary();
        }

        return service.getMaintenancesSummaryByClient(client.getId());
    }

    @GetMapping
    public List<MaintenanceDetailsResponseDTO> getAll (Authentication authentication, @RequestParam(required = false) String status) {
        User client = (User) authentication.getPrincipal();
        String formattedStatus = (status != null) ? status.toUpperCase() : null;

        if (client.getRole().equals(UserRole.employee)) {
            return service.getAll(formattedStatus);
        }

        return service.getAllByClient(client.getId(), formattedStatus);
    }


    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDetailsResponseDTO> findById(@PathVariable String id, Authentication authentication) {
        User client = (User) authentication.getPrincipal();
        MaintenanceDetailsResponseDTO response = service.findById(id, client);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/budget")
    public ResponseEntity<Void> setEstimatedBudget (@Valid @RequestBody BudgetRequestDTO request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        if (!user.getRole().equals(UserRole.employee)) {
            throw new ForbiddenAccessException("Clientes não possuem permissão para realizar orçamentos.");
        }

        service.setEstimatedBudget(request, user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/budget-answer")
    public ResponseEntity<MaintenanceDetailsResponseDTO> setBudgetAnswer (@Valid @RequestBody BudgetAnswerRequestDTO request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        if (!user.getRole().equals(UserRole.client)) {
            throw new ForbiddenAccessException("Apenas clientes devem aprovar ou recusar um orçamento proposto.");
        }

        Boolean answered = service.setBudgetAnswer(request, user);

        if (!answered) {
            throw new UpdateInvalidMaintenanceBudgetException("Não foi possível retornar uma resposta ao orçamento apresentado.");
        }

        return ResponseEntity.ok().build();
    }
}
