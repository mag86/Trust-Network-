package com.trust.task.service;

import com.trust.core.api.CreditService;
import com.trust.task.dto.TaskCreateRequest;
import com.trust.task.entity.Task;
import com.trust.task.entity.TaskStatus;
import com.trust.task.entity.TaskCategory;
import com.trust.task.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private CreditService creditService;

    @Transactional
    public Task createTask(TaskCreateRequest request, Long creatorId) {
        int balance = creditService.getUserBalance(creatorId);
        if (balance < 10) {
            throw new IllegalArgumentException("Недостаточно кредитов для создания задачи");
        }
        if (taskRepository.existsByTitleAndCreatorId(request.getTitle(), creatorId)) {
            throw new IllegalArgumentException("Похожие задачи уже существуют");
        }
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setCreditReward(request.getCreditReward());
        task.setDeadline(request.getDeadline());
        task.setCreatorId(creatorId);
        creditService.reserveCredits(creatorId, request.getCreditReward());
        return taskRepository.save(task);
    }

    public Page<Task> searchTasks(Double lat, Double lon, Integer radiusKm,
                                 TaskCategory category, Integer minCredit, Integer maxCredit,
                                 TaskStatus status, String deadlineBefore, Pageable pageable) {
        // Фильтрация по статусу (только OPEN), категория, ценовой диапазон, дедлайн
        // Геофильтр просто как stub (или можно позже через сервис)
        // TODO: добавить аутентичную работу с geo
        return taskRepository.searchWithFilters(category, minCredit, maxCredit, status, deadlineBefore, pageable);
    }
}
