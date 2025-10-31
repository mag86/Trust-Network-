package com.trust.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Location {
    @Id @GeneratedValue
    private Long id;
    private String address;
    private Double latitude;
    private Double longitude;
    // getters/setters/constructors
}
