package com.techfix.dto.response;

import java.math.BigDecimal;

public record CategoryRevenueResponseDTO(
        String categoryCode,
        String categoryName,
        BigDecimal totalRevenue
) {
}
