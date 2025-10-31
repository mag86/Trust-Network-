package com.trust.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Review {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private User author;
    @ManyToOne
    private User targetUser;
    private Integer rating;
    private String comment;
    private Long taskId;
    private LocalDateTime createdAt;
    // getters/setters/constructors
}
