package com.techfix.service;

import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.model.Category;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.Status;
import com.techfix.model.User;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.MaintenanceRequestRepository;
import com.techfix.repository.StatusRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final CategoryRepository categoryRepository;
    private final StatusRepository statusRepository;

    public MaintenanceRequestService(
            MaintenanceRequestRepository requestRepository,
            CategoryRepository categoryRepository,
            StatusRepository statusRepository ) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
        this.statusRepository = statusRepository;
    }

    @Transactional
    public MaintenanceRequest create(MaintenanceRequestDTO request, User client) {
        Category category = categoryRepository.findByCodeAndActiveTrue(request.categoryCode())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Categoria não encontrada"));

        Status status = statusRepository.findByCode("OPEN")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR, "Status inicial não cadastrado"));

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setItem(request.item().trim());
        maintenanceRequest.setItemDescription(request.itemDescription().trim());
        maintenanceRequest.setItemDefect(request.itemDefect().trim());
        maintenanceRequest.setCategory(category);
        maintenanceRequest.setClient(client);
        maintenanceRequest.setStatus(status);

        return requestRepository.save(maintenanceRequest);
    }

    public List<MaintenanceResponseDTO> getPendingMaintenances(Long clientId) {
        List<MaintenanceRequest> pendingMaintenances = requestRepository.findOpenAndPendingMaintenances(clientId);

        List<MaintenanceResponseDTO> responseList = pendingMaintenances.stream().map(
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
        return responseList;
    }


    public List<MaintenanceResponseDTO> getAllPending() {
        List<MaintenanceRequest> pendingMaintenances = requestRepository.findAllPending();

         return pendingMaintenances.stream()
                .map(
                    m -> {
                        String employeeName = m.getResponsibleEmployee() != null ? m.getResponsibleEmployee().getName() : null;
                        return new MaintenanceResponseDTO(
                                m.getId(),
                                m.getItem(),
                                m.getItemDescription(),
                                m.getItemDefect(),
                                m.getEstimatedPrice(),
                                m.getPrice(),
                                m.getCategory().getCode(),
                                employeeName
                        );
                    }
                ).toList();
    }

    public List<MaintenanceDetailsResponseDTO> getAll(String statusCode) {
        List<MaintenanceRequest> maintenances;

        if ( statusCode == null) {
            maintenances = requestRepository.findByDeletedAtIsNull();
        } else {
            maintenances = requestRepository.findByStatusCodeAndDeletedAtIsNull(statusCode);
        }

        return maintenances.stream().map(
                m -> {
                        return new MaintenanceDetailsResponseDTO(m);
                }
        ).toList();
    }

    public List<MaintenanceDetailsResponseDTO> getAllByClient(Long clientId, String statusCode) {
        List<MaintenanceRequest> maintenances;

        if ( statusCode == null) {
            maintenances = requestRepository.findByClientIdAndDeletedAtIsNull(clientId);
        } else {
            maintenances = requestRepository.findByStatusCodeAndClientIdAndDeletedAtIsNull(statusCode, clientId);
        }

        return maintenances.stream().map(
                m -> {
                    return new MaintenanceDetailsResponseDTO(m);
                }
        ).toList();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummary () {
        return requestRepository.getMaintenancesSummary();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummaryByClient (Long clientId) {
        return requestRepository.getMaintenancesSummaryByClient(clientId);
    }

    @Transactional(readOnly = true)
    public MaintenanceDetailsResponseDTO findById(String id, Long clientId) {
        Long maintenanceId = Long.parseLong(id);
        return requestRepository.findByIdAndClientId(maintenanceId, clientId)
                .map(MaintenanceDetailsResponseDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação de serviço não encontrada"));
    }


}