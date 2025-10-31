package com.trust.task.dto;

import com.trust.task.entity.TaskCategory;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class TaskCreateRequest {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    private TaskCategory category;

    @NotNull
    @Min(10)
    @Max(1000)
    private Integer creditReward;

    private LocalDateTime deadline;

    // getters/setters
}
