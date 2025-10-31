package com.trust.entity;

import java.time.LocalDateTime;
import java.util.Set;

import com.trust.entity.enums.UserStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class User {
    @Id @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    private String passwordHash;
    private String displayName;
    private String avatarUrl;
    private String bio;
    @ManyToMany
    private Set<Skill> skills;
    @ManyToOne
    private Location location;
    @Embedded
    private TrustScore trustScore;
    private Double creditBalance;
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    private LocalDateTime createdAt;
    // getters/setters/constructors
}
