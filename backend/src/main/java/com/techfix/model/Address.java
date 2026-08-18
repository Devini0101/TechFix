package com.techfix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

// lombok auto generates the getters and setter to the attributes
@Getter
@Setter
@Entity
@Table(name="address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 8)
    private String cep;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String street;

    @Column(columnDefinition = "TEXT")
    private String complement;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String neighborhood;

    @Column(nullable = false, length = 2)
    private String uf;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String city;
}
