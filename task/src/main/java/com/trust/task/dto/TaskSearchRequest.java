package com.trust.task.dto;

import com.trust.task.entity.TaskCategory;
import com.trust.task.entity.TaskStatus;
import jakarta.annotation.Nullable;

public class TaskSearchRequest {
    private Double lat;
    private Double lon;
    private Integer radiusKm = 10;
    private TaskCategory category;
    private Integer minCredit;
    private Integer maxCredit;
    private TaskStatus status = TaskStatus.OPEN;
    private Integer page = 0;
    private Integer size = 20;
    private String deadlineBefore;
    // getters/setters
}
