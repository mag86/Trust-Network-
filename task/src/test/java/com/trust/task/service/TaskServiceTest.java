package com.trust.task.service;

import com.trust.core.api.CreditService;
import com.trust.task.dto.TaskCreateRequest;
import com.trust.task.entity.Task;
import com.trust.task.entity.TaskCategory;
import com.trust.task.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private CreditService creditService;
    @InjectMocks
    private TaskService taskService;

    private TaskCreateRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new TaskCreateRequest();
        request.setTitle("Test Task");
        request.setDescription("Test Description");
        request.setCategory(TaskCategory.WORK);
        request.setCreditReward(100);
    }

    @Test
    void createTask_success() {
        when(creditService.getUserBalance(1L)).thenReturn(150);
        when(taskRepository.existsByTitleAndCreatorId(any(), any())).thenReturn(false);
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArguments()[0]);
        
        Task task = taskService.createTask(request, 1L);
        
        assertNotNull(task);
        verify(creditService).reserveCredits(eq(1L), eq(100));
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void createTask_lowBalance() {
        when(creditService.getUserBalance(1L)).thenReturn(5);
        
        assertThrows(IllegalArgumentException.class, () -> taskService.createTask(request, 1L));
    }
}

