package com.techfix.repository;

import com.techfix.model.MaintenanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    // Busca Full-Text Search nativa no PostgreSQL (descrição ou equipamento)
    @Query(value = """
        SELECT * FROM tb_maintenance_requests mr 
        WHERE to_tsvector('portuguese', mr.description || ' ' || mr.device_info) @@ plainto_tsquery('portuguese', :searchTerm)
        """, nativeQuery = true)
    List<MaintenanceRequest> searchByDescriptionOrDeviceFullText(@Param("searchTerm") String searchTerm);

    // Busca Full-Text Search Paginada
    @Query(value = """
        SELECT * FROM tb_maintenance_requests mr 
        WHERE to_tsvector('portuguese', mr.description || ' ' || mr.device_info) @@ plainto_tsquery('portuguese', :searchTerm)
        """,
            countQuery = """
        SELECT count(*) FROM tb_maintenance_requests mr 
        WHERE to_tsvector('portuguese', mr.description || ' ' || mr.device_info) @@ plainto_tsquery('portuguese', :searchTerm)
        """,
            nativeQuery = true)
    Page<MaintenanceRequest> searchByDescriptionOrDeviceFullTextPaged(@Param("searchTerm") String searchTerm, Pageable pageable);


    Page<MaintenanceRequest> findByClientId(Long clientId, Pageable pageable);

    Page<MaintenanceRequest> findByTechnicianId(Long technicianId, Pageable pageable);

    Page<MaintenanceRequest> findByStatusId(Long statusId, Pageable pageable);

    Page<MaintenanceRequest> findByStatusAndDateRange(
            @Param("statusId") Long statusId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
}