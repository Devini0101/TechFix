package com.techfix.model.enums;

import java.util.Arrays;

public enum Status {
    OPEN("Aberta", "#9CA3AF"),
    QUOTED("Orçada", "#895129"),
    REJECTED("Rejeitada", "#EF4444"),
    APPROVED("Aprovada", "#EAB308"),
    REDIRECTED("Redirecionada", "#A855F7"),
    REPAIRED("Arrumada", "#3B82F6"),
    PAID("Paga", "#F97316"),
    FINISHED("Finalizada", "#22C55E");

    private final String name;
    private final String color;

    Status(String name, String color) {
        this.name = name;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    // Helper method to check if a string is a valid status
    public static boolean isValid(String code) {
        if (code == null) return false;

        return Arrays.stream(Status.values())
                .anyMatch(status -> status.name().equalsIgnoreCase(code));
    }
}