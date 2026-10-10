package com.techfix.repository;

import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    @Query("""
        SELECT new com.techfix.dto.response.MaintenanceSummaryResponseDTO(
            COALESCE(SUM(CASE WHEN m.status = 'OPEN' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'QUOTED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'APPROVED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'REPAIRED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'REJECTED' THEN 1L ELSE 0L END), 0L)
        )
        FROM MaintenanceRequest m
        WHERE m.deletedAt IS NULL
    """)
    MaintenanceSummaryResponseDTO getMaintenancesSummary();

    @Query("""
        SELECT new com.techfix.dto.response.MaintenanceSummaryResponseDTO(
            COALESCE(SUM(CASE WHEN m.status = 'OPEN' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'QUOTED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'APPROVED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'REPAIRED' THEN 1L ELSE 0L END), 0L),
            COALESCE(SUM(CASE WHEN m.status = 'REJECTED' THEN 1L ELSE 0L END), 0L)
        )
        FROM MaintenanceRequest m
        WHERE m.deletedAt IS NULL
        AND m.client.id = :clientId
    """)
    MaintenanceSummaryResponseDTO getMaintenancesSummaryByClient(@Param("clientId") Long clientId);

    Optional<MaintenanceRequest> findById(Long id);

    Optional<MaintenanceRequest> findByIdAndClientId(Long id, Long clientId);


    @Query("""
        SELECT m FROM MaintenanceRequest m
        WHERE m.deletedAt IS NULL
        AND (:status IS NULL OR m.status = :status)
        AND (
            :searchPattern IS NULL
            OR LOWER(m.item) LIKE :searchPattern
            OR m.id = :searchId
        )
        ORDER BY m.createdAt DESC
    """)
    List<MaintenanceRequest> searchByStatusAndTerm(Status status, String searchPattern, Long searchId);

    @Query("""
        SELECT m FROM MaintenanceRequest m
        WHERE m.deletedAt IS NULL
        AND m.client.id = :clientId
        AND (:status IS NULL OR m.status = :status)
        AND (
            :searchPattern IS NULL
            OR LOWER(m.item) LIKE :searchPattern
            OR m.id = :searchId
        )
        ORDER BY m.createdAt DESC
    """)
    List<MaintenanceRequest> searchByStatusAndTermAndClient(Status status, String searchPattern, Long searchId, Long clientId);

    @Query("SELECT m FROM MaintenanceRequest m WHERE m.deletedAt IS NULL AND (:status IS NULL OR m.status = :status) ORDER BY m.createdAt ASC")
    List<MaintenanceRequest> findAllActive(@Param("status") Status status);

    @Query("SELECT m FROM MaintenanceRequest m WHERE m.deletedAt IS NULL AND m.client.id = :clientId AND (:status IS NULL OR m.status = :status) ORDER BY m.createdAt ASC")
    List<MaintenanceRequest> findAllActiveByClient(@Param("clientId") Long clientId, @Param("status") Status status);

    Optional<MaintenanceRequest> findByIdAndResponsibleEmployeeId(Long parsedId, Long id);
}