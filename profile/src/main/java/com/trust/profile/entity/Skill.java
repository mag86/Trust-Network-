package com.trust.profile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;

    @Column(nullable = false)
    private Integer level; // 1-5 (Новичок - Мастер)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillVerificationType verificationType;

    @Column(nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public SkillVerificationType getVerificationType() { return verificationType; }
    public void setVerificationType(SkillVerificationType verificationType) { this.verificationType = verificationType; }
    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}

