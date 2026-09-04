package com.techfix.dto.response;

import java.math.BigDecimal;

public record MaintenanceResponseDTO (
        Long id,
        String item,
        String itemDescription,
        String itemDefect,
        BigDecimal estimatedPrice,
        BigDecimal price,
        String categoryCode,
        String responsibleEmployeeName
) {
}
