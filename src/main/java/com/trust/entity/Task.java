package com.trust.entity;

import java.time.LocalDateTime;

import com.trust.entity.enums.TaskCategory;
import com.trust.entity.enums.TaskStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Task {
    @Id @GeneratedValue
    private Long id;
    private String title;
    private String description;
    private Double creditReward;
    @Enumerated(EnumType.STRING)
    private TaskCategory category;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    @ManyToOne
    private User creator;
    @ManyToOne
    private User executor;
    @ManyToOne
    private Location location;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    // getters/setters/constructors
}
