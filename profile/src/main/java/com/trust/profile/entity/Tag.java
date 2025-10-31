package com.trust.profile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    private TagType type = TagType.USER_DEFINED; // USER_DEFINED, AUTO_GENERATED, POPULAR

    @Column(nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public TagType getType() { return type; }
    public void setType(TagType type) { this.type = type; }
    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}

