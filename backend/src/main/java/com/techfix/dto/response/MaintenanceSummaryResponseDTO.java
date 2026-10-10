package com.techfix.dto.response;

public record MaintenanceSummaryResponseDTO(
        long pendingBudgets,
        long waitingApproval,
        long inMaintenance,
        long repaired,
        long canceled
) {
}
