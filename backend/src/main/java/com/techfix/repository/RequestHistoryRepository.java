package com.techfix.repository;

import com.techfix.model.RequestHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestHistoryRepository extends JpaRepository<RequestHistory, Long> {

    // Busca em ordem decrescente
    List<RequestHistory> findByMaintenanceRequestIdOrderByCreatedAtDesc(Long maintenanceRequestId);

    // Paginador para linhas do tempo extensas
    Page<RequestHistory> findByMaintenanceRequestId(Long maintenanceRequestId, Pageable pageable);

    // Full-Text Search nos comentários/notas de alteração de histórico
    @Query(value = """
        SELECT * FROM tb_request_history rh 
        WHERE rh.maintenance_request_id = :requestId 
          AND to_tsvector('portuguese', rh.notes) @@ plainto_tsquery('portuguese', :searchTerm)
        """, nativeQuery = true)
    List<RequestHistory> searchNotesByRequestIdFullText(
            @Param("requestId") Long requestId,
            @Param("searchTerm") String searchTerm
    );
}