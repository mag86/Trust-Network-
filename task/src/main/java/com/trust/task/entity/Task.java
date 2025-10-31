package com.trust.task.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, length=200)
    private String title;

    @Column(nullable=false, length=2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private TaskCategory category;

    @Column(nullable=false)
    private Integer creditReward;

    private LocalDateTime deadline;

    @Column(nullable = false)
    private Long creatorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private TaskStatus status = TaskStatus.OPEN;

    @Column(nullable = true)
    private Long executorId;

    // ... дополнительные поля и методы

    // getters/setters
}
