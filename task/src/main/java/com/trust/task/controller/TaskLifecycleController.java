package com.trust.task.controller;

import com.trust.task.entity.Task;
import com.trust.task.service.TaskLifecycleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskLifecycleController {
    @Autowired
    private TaskLifecycleService service;

    @PostMapping("/{taskId}/complete-by-executor")
    public ResponseEntity<Task> completeByExecutor(@PathVariable Long taskId, @RequestParam Long executorId) {
        return ResponseEntity.ok(service.markAsCompletedByExecutor(taskId, executorId));
    }
    @PostMapping("/{taskId}/confirm-by-creator")
    public ResponseEntity<Task> confirmByCreator(@PathVariable Long taskId, @RequestParam Long creatorId) {
        return ResponseEntity.ok(service.confirmCompletedByCreator(taskId, creatorId));
    }
    @PostMapping("/{taskId}/cancel")
    public ResponseEntity<Task> cancel(@PathVariable Long taskId, @RequestParam Long userId) {
        return ResponseEntity.ok(service.cancel(taskId, userId));
    }
    @PostMapping("/{taskId}/select-executor")
    public ResponseEntity<Task> selectExecutor(@PathVariable Long taskId, @RequestParam Long creatorId, @RequestParam Long executorId) {
        return ResponseEntity.ok(service.startTaskProgress(taskId, creatorId, executorId));
    }
}
