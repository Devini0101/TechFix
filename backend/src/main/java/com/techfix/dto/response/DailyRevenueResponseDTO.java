package com.techfix.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyRevenueResponseDTO(
        LocalDate date,
        BigDecimal totalRevenue
) {}
