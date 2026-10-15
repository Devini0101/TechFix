package com.techfix.dto.request;

import com.techfix.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PaymentRequestDTO(
        @NotNull(message = "O método de pagamento é obrigatório")
        PaymentMethod paymentMethod
) {
}
