package com.techfix.controller;

import com.techfix.dto.request.*;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceHistoryResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.exception.ForbiddenAccessException;
import com.techfix.exception.UpdateInvalidMaintenanceBudgetException;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.service.MaintenanceRequestService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance-request" )
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    public MaintenanceRequestController(
            MaintenanceRequestService service
    ) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(
            @Valid @RequestBody MaintenanceRequestDTO request,
            @AuthenticationPrincipal User client
    ) {
        service.create(request, client);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping("/summary")
    public MaintenanceSummaryResponseDTO getMaintenanceSummary(
            @AuthenticationPrincipal User user
    ) {

        if (user.getRole() == UserRole.employee) {
            return service.getMaintenancesSummary();
        }

        return service.getMaintenancesSummaryByClient(user.getId());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MaintenanceDetailsResponseDTO>> searchMaintenancesByTermAndDate(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String term,
            @AuthenticationPrincipal User user
    ) {
        List<MaintenanceDetailsResponseDTO> result = service.searchByTermAndDate(startDate, endDate, term, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public List<MaintenanceDetailsResponseDTO> getAll(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @AuthenticationPrincipal User user
    ) {
        return service.getAll(startDate, endDate, user);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<MaintenanceHistoryResponseDTO>> getHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        List<MaintenanceHistoryResponseDTO> maintenanceHistory = service.getMaintenanceHistory(id, user);
        return ResponseEntity.ok(maintenanceHistory);
    }

    @PostMapping("/{id}/repair")
    public ResponseEntity<Long> repairMaintenance (@PathVariable Long id, @Valid @RequestBody RepairRequestDTO request, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado!");
        }

        return this.service.repairMaintenance(id, request, user);
    }

    @PutMapping("/{id}/redirect")
    public ResponseEntity<Long> redirectMaintenance(@PathVariable String id, @RequestBody RedirectRequestDTO request, @AuthenticationPrincipal User user){
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado!");
        }

        Long parsedId = Long.parseLong(id);

        return this.service.updateMaintenanceResponsibleEmployee(parsedId, request.email(), user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceDetailsResponseDTO> findById(@PathVariable String id, @AuthenticationPrincipal User user) {
        MaintenanceDetailsResponseDTO response = service.findById(id, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/approve")
    public ResponseEntity<Void> approveService(
            @Valid @RequestBody ApprovalRequestDTO request,
            @AuthenticationPrincipal User user
    ) {
        if (user.getRole() != UserRole.client) {
            throw new ForbiddenAccessException(
                    "Somente clientes podem aprovar servicos."
            );
        }

        service.approveService(request, user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/budget")
    public ResponseEntity<Void> setEstimatedBudget(
            @Valid @RequestBody BudgetRequestDTO request,
            @AuthenticationPrincipal User user
    ) {

        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException(
                    "Clientes nao possuem permissao para realizar orcamentos."
            );
        }

        service.setEstimatedBudget(request, user);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/budget-answer")
    public ResponseEntity<Void> setBudgetAnswer (@Valid @RequestBody BudgetAnswerRequestDTO request, @AuthenticationPrincipal User user) {

        if (user.getRole() != UserRole.client) {
            throw new ForbiddenAccessException(
                    "Apenas clientes devem aprovar ou recusar um orcamento proposto."
            );
        }

        boolean answered = service.setBudgetAnswer(request, user);
        if (!answered) {
            throw new UpdateInvalidMaintenanceBudgetException(
                    "Nao foi possivel retornar uma resposta ao orcamento apresentado."
            );
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/rescue")
    public ResponseEntity<Void> rescueMaintenance ( @RequestBody Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.client){
            throw new ForbiddenAccessException("Apenas clientes podem realizar o resgate de sua manutenção");
        }

        boolean rescued = service.rescueMaintenance(id, user);

        if (!rescued) {
            throw new UpdateInvalidMaintenanceBudgetException("Não foi possível realizar o resgate da manutenção.");
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<Void> payMaintenance(@PathVariable Long id, @Valid @RequestBody PaymentRequestDTO request,
            @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.client) {
            throw new ForbiddenAccessException(
                    "Somente clientes podem realizar pagamentos."
            );
        }

        service.payMaintenance(id, request, user);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/finish")
    public ResponseEntity<Void> finishMaintenance( @PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Não foi possível finalizar serviço");
        }

        service.finishMaintenance(id, user);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/report")
    public ResponseEntity<byte[]> getRevenueReport(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate endDate,
            @AuthenticationPrincipal User user) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }

        byte[] pdf = service.generateRevenueReport(startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-receitas.pdf")
                .body(pdf);
    }

    @GetMapping("/report/category")
    public ResponseEntity<byte[]> getCategoryRevenueReport(
            @AuthenticationPrincipal User user
    ) {
        if (user.getRole() != UserRole.employee) {
            throw new ForbiddenAccessException("Acesso negado.");
        }

        byte[] pdf = service.generateCategoryRevenueReport();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=relatorio-receitas-por-categoria.pdf"
                )
                .body(pdf);
    }
}
