package com.trust.reputation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long taskId;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private Long targetUserId;

    // Детальные оценки (0.0 - 5.0 с шагом 0.5)
    @Column(nullable = false)
    private Double qualityRating; // 40% веса

    @Column(nullable = false)
    private Double timelinessRating; // 30% веса

    @Column(nullable = false)
    private Double communicationRating; // 20% веса

    @Column(nullable = false)
    private Double valueRating; // 10% веса

    // Общая средняя оценка (взвешенная)
    @Column(nullable = false)
    private Double overallRating;

    @Column(length = 1000)
    private String publicComment;

    @Column(length = 1000)
    private String privateComment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime editedAt;

    @Column(nullable = false)
    private Boolean isModerated = false;

    // Ответ на отзыв
    @OneToOne
    private Review reply;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }
    public Double getQualityRating() { return qualityRating; }
    public void setQualityRating(Double qualityRating) { this.qualityRating = qualityRating; }
    public Double getTimelinessRating() { return timelinessRating; }
    public void setTimelinessRating(Double timelinessRating) { this.timelinessRating = timelinessRating; }
    public Double getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Double communicationRating) { this.communicationRating = communicationRating; }
    public Double getValueRating() { return valueRating; }
    public void setValueRating(Double valueRating) { this.valueRating = valueRating; }
    public Double getOverallRating() { return overallRating; }
    public void setOverallRating(Double overallRating) { this.overallRating = overallRating; }
    public String getPublicComment() { return publicComment; }
    public void setPublicComment(String publicComment) { this.publicComment = publicComment; }
    public String getPrivateComment() { return privateComment; }
    public void setPrivateComment(String privateComment) { this.privateComment = privateComment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getEditedAt() { return editedAt; }
    public void setEditedAt(LocalDateTime editedAt) { this.editedAt = editedAt; }
    public Boolean getIsModerated() { return isModerated; }
    public void setIsModerated(Boolean isModerated) { this.isModerated = isModerated; }
    public Review getReply() { return reply; }
    public void setReply(Review reply) { this.reply = reply; }
}

