package com.trust.task.service;

import com.trust.core.escrow.EscrowService;
import com.trust.task.entity.Task;
import com.trust.task.entity.TaskStatus;
import com.trust.task.repository.TaskRepository;
import com.trust.task.bid.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskLifecycleService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private EscrowService escrowService;

    @Transactional
    public Task markAsCompletedByExecutor(Long taskId, Long executorId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Задача не найдена"));
        if (!executorId.equals(task.getExecutorId()))
            throw new IllegalArgumentException("Можно завершать только свои задачи");
        if (task.getStatus() != TaskStatus.IN_PROGRESS)
            throw new IllegalStateException("Задача не в работе");
        task.setStatus(TaskStatus.COMPLETED);
        taskRepository.save(task);
        // todo: уведомить заказчика
        return task;
    }

    @Transactional
    public Task confirmCompletedByCreator(Long taskId, Long creatorId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Задача не найдена"));
        if (!creatorId.equals(task.getCreatorId()))
            throw new IllegalArgumentException("Нет прав подтверждать выполнение");
        if (task.getStatus() != TaskStatus.COMPLETED)
            throw new IllegalStateException("Нельзя подтвердить невыполненную");
        escrowService.releaseToExecutor(taskId, task.getExecutorId());
        task.setStatus(TaskStatus.COMPLETED);
        taskRepository.save(task);
        // todo: уведомить исполнителя
        return task;
    }

    @Transactional
    public Task cancel(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Задача не найдена"));
        if (!userId.equals(task.getCreatorId()))
            throw new IllegalArgumentException("Только автор может отменить задачу");
        task.setStatus(TaskStatus.CANCELLED);
        escrowService.refundToCreator(taskId, userId);
        // todo: уведомить исполнителя
        return taskRepository.save(task);
    }

    @Transactional
    public Task startTaskProgress(Long taskId, Long creatorId, Long executorId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Задача не найдена"));
        if (!creatorId.equals(task.getCreatorId()))
            throw new IllegalArgumentException("Только создатель может выбрать исполнителя");
        if (task.getStatus() != TaskStatus.OPEN)
            throw new IllegalStateException("Задача не открыта для назначения");
        task.setExecutorId(executorId);
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    @Scheduled(cron = "0 0/10 * * * *") // каждые 10 минут
    @Transactional
    public void autoExpireTasks() {
        LocalDateTime now = LocalDateTime.now();
        // Задачи EXPIRED — просрочены по дедлайну
        List<Task> expired = taskRepository.findByDeadlineBeforeAndStatusIn(now, List.of(TaskStatus.OPEN, TaskStatus.IN_PROGRESS));
        for (Task t : expired) {
            t.setStatus(TaskStatus.EXPIRED);
            escrowService.refundToCreator(t.getId(), t.getCreatorId());
            taskRepository.save(t);
        }
    }

    @Scheduled(cron = "0 10 2 * * *") // раз в сутки
    @Transactional
    public void autoCancelStaleTasks() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Task> stale = taskRepository.findOpenWithoutBidsBeforeDate(weekAgo);
        for (Task t : stale) {
            t.setStatus(TaskStatus.CANCELLED);
            escrowService.refundToCreator(t.getId(), t.getCreatorId());
            taskRepository.save(t);
        }
    }
}
