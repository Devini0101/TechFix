package com.techfix.dto.response;

import com.techfix.model.RequestHistory;
import java.time.LocalDateTime;

public record MaintenanceHistoryResponseDTO(
    String action,
    String description,
    String employeeName,
    String newStatus,
    String previousStatus,
    LocalDateTime createdAt
) {
    public MaintenanceHistoryResponseDTO(RequestHistory h) {
        this(
                h.getAction(),
                h.getDescription(),
                h.getEmployee() != null ? h.getEmployee().getName() : null,
                h.getNewStatus() != null ? h.getNewStatus().getName() : null,
                h.getPreviousStatus() != null ? h.getPreviousStatus().getName() : null,
                h.getCreatedAt()
        );
    }
}
