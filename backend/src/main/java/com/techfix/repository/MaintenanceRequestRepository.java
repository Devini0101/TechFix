package com.techfix.repository;

import com.techfix.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    @Query("SELECT m FROM MaintenanceRequest m WHERE " +
            "m.estimatedPrice IS NULL " +
            "AND m.deletedAt IS NULL " +
            "AND m.responsibleEmployee IS NULL " +
            "AND m.status.code IN ('OPEN', 'WAITING_APPROVAL')")
    List<MaintenanceRequest> findOpenAndPendingMaintenances(Long clientId);

    Optional<MaintenanceRequest> findByIdAndClientId(Long id, Long clientId);
}