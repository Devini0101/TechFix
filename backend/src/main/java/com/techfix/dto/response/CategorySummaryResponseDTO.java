package com.techfix.dto.response;

public record CategorySummaryResponseDTO(
        Long totalAmount,
        Long active,
        Long inactive
) {
}
