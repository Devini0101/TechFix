package com.techfix.service;

import com.techfix.dto.request.ApprovalRequestDTO;
import com.techfix.dto.request.BudgetAnswerRequestDTO;
import com.techfix.dto.request.BudgetRequestDTO;
import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceHistoryResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.events.StatusChangedEvent;
import com.techfix.exception.InvalidMaintenanceApprovalException;
import com.techfix.exception.UpdateInvalidMaintenanceBudgetException;
import com.techfix.model.Category;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.RequestHistory;
import com.techfix.model.User;
import com.techfix.model.enums.Status;
import com.techfix.model.enums.UserRole;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.MaintenanceRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MaintenanceRequestService(
            MaintenanceRequestRepository requestRepository,
            CategoryRepository categoryRepository, ApplicationEventPublisher eventPublisher) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public MaintenanceRequest create(
            MaintenanceRequestDTO request,
            User client
    ) {
        Category category = categoryRepository
                .findByCodeAndActiveTrue(request.categoryCode())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria nao encontrada"
                        )
                );

        MaintenanceRequest maintenanceRequest =
                new MaintenanceRequest();

        maintenanceRequest.setItem(request.item().trim());
        maintenanceRequest.setItemDescription(
                request.itemDescription().trim()
        );
        maintenanceRequest.setItemDefect(
                request.itemDefect().trim()
        );
        maintenanceRequest.setCategory(category);
        maintenanceRequest.setClient(client);
        maintenanceRequest.setStatus(Status.OPEN);

        return requestRepository.save(maintenanceRequest);
    }

    public List<MaintenanceDetailsResponseDTO> getAll(
            String statusCode
    ) {
        List<MaintenanceRequest> maintenances;

        if (statusCode == null) {
            maintenances = requestRepository
                    .findByDeletedAtIsNullOrderByCreatedAtAsc();
        } else {
            if (!Status.isValid(statusCode)) {
                throw new EntityNotFoundException(
                        "Nao foi possivel encontrar o codigo "
                                + statusCode
                );
            }

            Status statusEnum = Status.valueOf(
                    statusCode.toUpperCase()
            );

            maintenances = requestRepository
                    .findByStatusAndDeletedAtIsNull(statusEnum);
        }

        return maintenances.stream()
                .map(MaintenanceDetailsResponseDTO::new)
                .toList();
    }

    public List<MaintenanceDetailsResponseDTO> getAllByClient(
            Long clientId,
            String statusCode
    ) {
        List<MaintenanceRequest> maintenances;

        if (statusCode == null) {
            maintenances = requestRepository
                    .findByClientIdAndDeletedAtIsNullOrderByCreatedAtAsc(
                            clientId
                    );
        } else {
            if (!Status.isValid(statusCode)) {
                throw new EntityNotFoundException(
                        "Nao foi possivel encontrar o codigo "
                                + statusCode
                );
            }

            Status statusEnum = Status.valueOf(
                    statusCode.toUpperCase()
            );

            maintenances = requestRepository
                    .findByStatusAndClientIdAndDeletedAtIsNull(
                            statusEnum,
                            clientId
                    );
        }

        return maintenances.stream()
                .map(MaintenanceDetailsResponseDTO::new)
                .toList();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummary() {
        return requestRepository.getMaintenancesSummary();
    }

    public MaintenanceSummaryResponseDTO
    getMaintenancesSummaryByClient(Long clientId) {
        return requestRepository
                .getMaintenancesSummaryByClient(clientId);
    }

    @Transactional(readOnly = true)
    public MaintenanceDetailsResponseDTO findById(
            String id,
            User client
    ) {
        Long maintenanceId = Long.parseLong(id);

        if (client.getRole().equals(UserRole.employee)) {
            return requestRepository
                    .findById(maintenanceId)
                    .map(MaintenanceDetailsResponseDTO::new)
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "Solicitacao nao existente"
                            )
                    );
        }

        return requestRepository
                .findByIdAndClientId(
                        maintenanceId,
                        client.getId()
                )
                .map(MaintenanceDetailsResponseDTO::new)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Solicitacao de servico nao encontrada"
                        )
                );
    }

    @Transactional
    public void approveService(
            ApprovalRequestDTO dto,
            User client
    ) {
        MaintenanceRequest request = requestRepository
                .findByIdAndClientId(
                        dto.id(),
                        client.getId()
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Solicitacao nao encontrada para este cliente"
                        )
                );

        if (request.getStatus() != Status.QUOTED) {
            throw new InvalidMaintenanceApprovalException(
                    "Somente servicos orcados podem ser aprovados"
            );
        }

        request.setStatus(Status.APPROVED);

        requestRepository.save(request);
    }

    @Transactional
    public void setEstimatedBudget(
            BudgetRequestDTO dto,
            User user
    ) {
        MaintenanceRequest request = requestRepository
                .findById(dto.id())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Servico nao encontrado"
                        )
                );

        if (!request.getStatus().equals(Status.OPEN)
                && !request.getStatus().equals(Status.QUOTED)) {
            throw new UpdateInvalidMaintenanceBudgetException(
                    "Nao e possivel alterar o orcamento"
                            + " de uma manutencao invalida."
            );
        }

        Status previousStatus = request.getStatus();
        request.setEstimatedPrice(dto.value());
        request.setStatus(Status.QUOTED);
        request.setResponsibleEmployee(user);

        eventPublisher.publishEvent(new StatusChangedEvent(
                request,
                previousStatus,
                Status.APPROVED,
                user,
                "ORÇADA",
                "Orçamento de manutenção realizado."
        ));

        requestRepository.save(request);
    }

    @Transactional
    public boolean setBudgetAnswer(
            @Valid BudgetAnswerRequestDTO request,
            User user
    ) {
        Optional<MaintenanceRequest> optionalRequest =
                requestRepository.findByIdAndClientId(
                        request.id(),
                        user.getId()
                );

        if (optionalRequest.isEmpty()) {
            return false;
        }

        MaintenanceRequest req =
                optionalRequest.get();

        // Valida se o status atual é de orçacada ou rejeitada (status quem podem ir para aprovado)
        if (!req.getStatus().equals(Status.QUOTED)) {
            return false;
        }

        Status previousStatus = req.getStatus();
        String answer = request.answer().toUpperCase();

        if (answer.equals("APPROVED")) {
            req.setStatus(Status.APPROVED);
            req.setPrice(req.getEstimatedPrice());
            eventPublisher.publishEvent(new StatusChangedEvent(
                    req,
                    previousStatus,
                    Status.APPROVED,
                    user,
                    "ORÇAMENTO APROVADO",
                    "Orçamento de manutenção APROVADO e inserido no fluxo."
            ));
        } else if (answer.equals("REJECTED")) {
            req.setStatus(Status.REJECTED);
            eventPublisher.publishEvent(new StatusChangedEvent(
                    req,
                    previousStatus,
                    Status.REJECTED,
                    user,
                    "ORÇAMENTO REJEITADO",
                    "Orçamento de manutenção REJEITADA e removida no fluxo."
            ));

        }

        requestRepository.save(req);

        return true;
    }

    @Transactional
    public boolean rescueMaintenance(Long id, User user) {
        Optional<MaintenanceRequest> optionalReq = requestRepository.findByIdAndClientId(id, user.getId());

        if (optionalReq.isEmpty()) {
            return false;
        }

        MaintenanceRequest req = optionalReq.get();

        //only rejected requests can be rescued
        if (!req.getStatus().equals(Status.REJECTED) ) {
            return false;
        }

        Status previousStatus = req.getStatus();

        req.setStatus(Status.APPROVED);
        req.setPrice(req.getEstimatedPrice());
        requestRepository.save(req);
        eventPublisher.publishEvent(new StatusChangedEvent(
                req,
                previousStatus,
                Status.APPROVED,
                user,
                "SERVIÇO RESGATADO",
                "Manutenção resgatada de REJEITADO para APROVADO e reinserido no fluxo."
        ));
        return true;
    }

    public List<MaintenanceDetailsResponseDTO> searchByStatusAndTerm(String status, String term, User user) {

        Status statusEnum = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            if (!Status.isValid(status)) {
                throw new IllegalArgumentException("Status inválido ");
            }
            statusEnum = Status.valueOf(status.toUpperCase());
        }

        Long searchId = null;
        String searchPattern = null;

        if (term != null && !term.isBlank()) {
            term = term.trim();
            // Se so tiver números, converte para buscar pelo id
            if (term.matches("\\d+")) {
                searchId = Long.parseLong(term);
            }
            searchPattern = "%" + term.toLowerCase() + "%";
        }

        List<MaintenanceRequest> requests;

        if (user.getRole().equals(UserRole.employee)) {
            requests = requestRepository.searchByStatusAndTerm(statusEnum, searchPattern, searchId);
        } else {
            requests = requestRepository.searchByStatusAndTermAndClient(statusEnum, searchPattern, searchId, user.getId());
        }

        return requests.stream().map(MaintenanceDetailsResponseDTO::new).toList();
    }

    public List<MaintenanceHistoryResponseDTO> getMaintenanceHistory(Long id, User user) {
        Optional<MaintenanceRequest> maintenance;

        if (user.getRole() == UserRole.client) {
            maintenance = requestRepository.findByIdAndClientId(id, user.getId());
        } else {
            maintenance = requestRepository.findById(id);
        }

        if (!maintenance.isPresent()) {
            throw new EntityNotFoundException("Manutenção não encontrada!");
        }

        List<RequestHistory> history = maintenance.get().getHistory();

        return history.stream().map(MaintenanceHistoryResponseDTO::new).toList();
    }
}
