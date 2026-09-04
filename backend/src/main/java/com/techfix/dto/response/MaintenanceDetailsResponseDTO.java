package com.techfix.dto.response;

import com.techfix.model.MaintenanceRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MaintenanceDetailsResponseDTO (
        Long id,
        String item,
        String itemDescription,
        String itemDefect,
        BigDecimal estimatedPrice,
        BigDecimal price,
        String categoryCode,
        String statusCode,
        String statusColor,
        LocalDateTime createdAt,
        String orientation,
        String responsibleEmployeeName
) {
    public MaintenanceDetailsResponseDTO(MaintenanceRequest m) {
        this(
                m.getId(),
                m.getItem(),
                m.getItemDescription(),
                m.getItemDefect(),
                m.getEstimatedPrice(),
                m.getPrice(),
                m.getCategory() != null ? m.getCategory().getCode() : null,
                m.getStatus() != null ? m.getStatus().getCode() : null,
                m.getStatus() != null ? m.getStatus().getColor() : null,
                m.getCreatedAt(),
                m.getOrientation(),
                m.getResponsibleEmployee() != null ? m.getResponsibleEmployee().getName() : null
        );
    }
}
