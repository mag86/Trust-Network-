package com.trust.task.controller;

import com.trust.task.dto.TaskCreateRequest;
import com.trust.task.entity.Task;
import com.trust.task.service.TaskService;
import com.trust.task.dto.TaskSearchRequest;
import com.trust.task.entity.TaskCategory;
import com.trust.task.entity.TaskStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "API для управления задачами и услугами")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping
    @Operation(summary = "Создание задачи", description = "Создание новой задачи с резервированием кредитов")
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskCreateRequest req,
                                           @RequestParam Long userId) {
        Task created = taskService.createTask(req, userId);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск задач", description = "Поиск задач с фильтрацией по категории, цене, статусу и геолокации")
    public ResponseEntity<Page<Task>> searchTasks(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon,
            @RequestParam(required = false, defaultValue = "10") Integer radiuskm,
            @RequestParam(required = false) TaskCategory category,
            @RequestParam(required = false) Integer minCredit,
            @RequestParam(required = false) Integer maxCredit,
            @RequestParam(required = false, defaultValue = "OPEN") TaskStatus status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false) String deadlineBefore) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, Math.min(size, 20));
        Page<Task> result = taskService.searchTasks(lat, lon, radiuskm, category, minCredit, maxCredit, status, deadlineBefore, pageable);
        return ResponseEntity.ok(result);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
