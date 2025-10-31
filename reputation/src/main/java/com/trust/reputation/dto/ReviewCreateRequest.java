package com.trust.reputation.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class ReviewCreateRequest {
    @NotNull
    private Long taskId;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private Double qualityRating; // 40%

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private Double timelinessRating; // 30%

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private Double communicationRating; // 20%

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private Double valueRating; // 10%

    @Size(max = 1000)
    private String publicComment;

    @Size(max = 1000)
    private String privateComment;

    // getters/setters
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Double getQualityRating() { return qualityRating; }
    public void setQualityRating(Double qualityRating) { this.qualityRating = qualityRating; }
    public Double getTimelinessRating() { return timelinessRating; }
    public void setTimelinessRating(Double timelinessRating) { this.timelinessRating = timelinessRating; }
    public Double getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Double communicationRating) { this.communicationRating = communicationRating; }
    public Double getValueRating() { return valueRating; }
    public void setValueRating(Double valueRating) { this.valueRating = valueRating; }
    public String getPublicComment() { return publicComment; }
    public void setPublicComment(String publicComment) { this.publicComment = publicComment; }
    public String getPrivateComment() { return privateComment; }
    public void setPrivateComment(String privateComment) { this.privateComment = privateComment; }
}

