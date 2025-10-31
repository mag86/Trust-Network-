package com.trust.profile.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class UserBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long blockerUserId; // Кто блокирует

    @Column(nullable = false)
    private Long blockedUserId; // Кого блокируют

    @Column(nullable = false)
    private LocalDateTime blockedAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBlockerUserId() { return blockerUserId; }
    public void setBlockerUserId(Long blockerUserId) { this.blockerUserId = blockerUserId; }
    public Long getBlockedUserId() { return blockedUserId; }
    public void setBlockedUserId(Long blockedUserId) { this.blockedUserId = blockedUserId; }
    public LocalDateTime getBlockedAt() { return blockedAt; }
    public void setBlockedAt(LocalDateTime blockedAt) { this.blockedAt = blockedAt; }
}

