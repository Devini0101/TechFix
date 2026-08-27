package com.techfix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "request_history")
public class RequestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "maintenance_request_id", nullable = false)
    private Long maintenanceRequest;

    @Column(name = "employee_id", nullable = false)
    private Long employee;

    @Column(name = "destination_employee_id")
    private Long destinationEmployee;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String action;

    @Column(columnDefinition = "TEXT")
    private String description;

}