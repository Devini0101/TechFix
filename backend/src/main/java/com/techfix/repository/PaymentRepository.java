package com.techfix.repository;

import com.techfix.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Busca única do pagamento por ordem de serviço
    Optional<Payment> findByMaintenanceRequestId(Long maintenanceRequestId);

    // Busca de um cliente especifico
    @Query("SELECT p FROM Payment p WHERE p.maintenanceRequest.client.id = :clientId")
    Page<Payment> findByClientId(@Param("clientId") Long clientId, Pageable pageable);

    // Consulta localizando por transiçao
    @Query(value = "SELECT * FROM tb_payments p WHERE p.transaction_id = :transactionId", nativeQuery = true)
    Optional<Payment> findByTransactionIdNative(@Param("transactionId") String transactionId);

    // Fatural total em certo tempo
    @Query("""
        SELECT SUM(p.amount) FROM Payment p 
        WHERE p.createdAt BETWEEN :startDate AND :endDate
        """)
    BigDecimal calculateTotalRevenueBetweenDates(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}