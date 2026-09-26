package com.techfix.service;

import com.techfix.dto.request.BudgetAnswerRequestDTO;
import com.techfix.dto.request.BudgetRequestDTO;
import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.exception.UpdateInvalidMaintenanceBudgetException;
import com.techfix.model.Category;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.enums.Status;
import com.techfix.model.User;
import com.techfix.model.enums.UserRole;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.MaintenanceRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.aspectj.bridge.IMessage;
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

    public MaintenanceRequestService(
            MaintenanceRequestRepository requestRepository,
            CategoryRepository categoryRepository) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public MaintenanceRequest create(MaintenanceRequestDTO request, User client) {
        Category category = categoryRepository.findByCodeAndActiveTrue(request.categoryCode())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setItem(request.item().trim());
        maintenanceRequest.setItemDescription(request.itemDescription().trim());
        maintenanceRequest.setItemDefect(request.itemDefect().trim());
        maintenanceRequest.setCategory(category);
        maintenanceRequest.setClient(client);
        maintenanceRequest.setStatus(Status.OPEN);

        return requestRepository.save(maintenanceRequest);
    }

    public List<MaintenanceResponseDTO> getPendingMaintenances(Long clientId) {
        List<MaintenanceRequest> pendingMaintenances = requestRepository.findOpenAndPendingMaintenances(clientId);

        return pendingMaintenances.stream().map(
                m -> {
                    String responsibleEmployee = m.getResponsibleEmployee() != null ? m.getResponsibleEmployee().getName() : null;
                    String categoryCode = m.getCategory().getCode();
                    return new MaintenanceResponseDTO(
                            m.getId(),
                            m.getItem(),
                            m.getItemDescription(),
                            m.getItemDefect(),
                            m.getEstimatedPrice(),
                            m.getPrice(),
                            categoryCode,
                            responsibleEmployee
                    );
                }
        ).toList();
    }


    public List<MaintenanceDetailsResponseDTO> getAll(String statusCode) {
        List<MaintenanceRequest> maintenances;

        //traz todos independente do status
        if ( statusCode == null) {
            maintenances = requestRepository.findByDeletedAtIsNullOrderByCreatedAtAsc();
        } else {

            if (!Status.isValid(statusCode)) {
                throw new EntityNotFoundException("Não foi possível encontrar o código " + statusCode);
            }

            Status statusEnum = Status.valueOf(statusCode.toUpperCase());

            maintenances = requestRepository.findByStatusAndDeletedAtIsNull(statusEnum);
        }

        return maintenances.stream().map(
                MaintenanceDetailsResponseDTO::new
        ).toList();
    }

    public List<MaintenanceDetailsResponseDTO> getAllByClient(Long clientId, String statusCode) {
        List<MaintenanceRequest> maintenances;

        if ( statusCode == null) {
            maintenances = requestRepository.findByClientIdAndDeletedAtIsNullOrderByCreatedAtAsc(clientId);
        } else {

            if (!Status.isValid(statusCode)) {
                throw new EntityNotFoundException("Não foi possível encontrar o código " + statusCode);
            }

            Status statusEnum = Status.valueOf(statusCode.toUpperCase());

            maintenances = requestRepository.findByStatusAndClientIdAndDeletedAtIsNull(statusEnum, clientId);
        }

        return maintenances.stream().map(
                MaintenanceDetailsResponseDTO::new
        ).toList();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummary () {
        return requestRepository.getMaintenancesSummary();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummaryByClient (Long clientId) {
        return requestRepository.getMaintenancesSummaryByClient(clientId);
    }

    @Transactional(readOnly = true)
    public MaintenanceDetailsResponseDTO findById(String id, User client) {
        Long maintenanceId = Long.parseLong(id);

        //caso do funcionário (pode ver todos)
        if (client.getRole().equals(UserRole.employee)){
            return requestRepository.findById(maintenanceId)
                    .map(MaintenanceDetailsResponseDTO::new)
                    .orElseThrow( () -> new EntityNotFoundException("Solicitação não existente"));
        }

        return requestRepository.findByIdAndClientId(maintenanceId, client.getId())
                .map(MaintenanceDetailsResponseDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação de serviço não encontrada"));
    }


    @Transactional
    public void setEstimatedBudget( BudgetRequestDTO dto, User user) {
        MaintenanceRequest request = requestRepository.findById(dto.id())
                .orElseThrow( () -> new EntityNotFoundException("Serviço não encontrado"));

        if (!request.getStatus().equals(Status.OPEN) && !request.getStatus().equals(Status.QUOTED) ) {
            throw new UpdateInvalidMaintenanceBudgetException("Não é possível alterar o orçamento de uma manuteção que não seja nova ou esteja em orçamento.");
        }

        request.setEstimatedPrice(dto.value());
        request.setStatus(Status.QUOTED);
        request.setResponsibleEmployee(user);
        requestRepository.save(request);
    }

    @Transactional
    public boolean setBudgetAnswer(@Valid BudgetAnswerRequestDTO request, User user) {
        Optional<MaintenanceRequest> optionalReq = requestRepository.findByIdAndClientId(request.id(), user.getId());

        if (optionalReq.isEmpty()) {
            return false;
        }

        MaintenanceRequest req = optionalReq.get();

        // Valida se o status atual é de orçacada
        if (req.getStatus() != Status.QUOTED) {
            return false;
        }

        String answer = request.answer().toUpperCase();

        if (answer.equals("APPROVED")) {
            req.setStatus(Status.APPROVED);
        } else if (answer.equals("REJECTED")) {
            req.setStatus(Status.REJECTED);
        } else {
            return false;
        }

        requestRepository.save(req);
        return true;
    }
}