package com.techfix.repository;

import com.techfix.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findAllByClientIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long clientId);
}