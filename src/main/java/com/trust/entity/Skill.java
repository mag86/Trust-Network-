package com.trust.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Skill {
    @Id @GeneratedValue
    private Long id;
    private String name;
    // getters/setters/constructors
}
