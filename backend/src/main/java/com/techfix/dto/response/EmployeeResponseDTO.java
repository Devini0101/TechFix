package com.techfix.dto.response;

public record EmployeeResponseDTO(
        Long id,
        String name,
        String email,
        String phone,
        long activeOrders
) {
}
