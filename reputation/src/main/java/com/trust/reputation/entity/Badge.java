package com.trust.reputation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeType type;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean isRare = false;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public BadgeType getType() { return type; }
    public void setType(BadgeType type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
    public Boolean getIsRare() { return isRare; }
    public void setIsRare(Boolean isRare) { this.isRare = isRare; }
}

