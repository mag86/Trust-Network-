package com.trust.task.lifecycle;

import com.trust.core.escrow.EscrowService;
import com.trust.task.entity.Task;
import com.trust.task.entity.TaskStatus;
import com.trust.task.repository.TaskRepository;
import com.trust.task.bid.BidRepository;
import com.trust.task.service.TaskLifecycleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskLifecycleServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private BidRepository bidRepository;
    @Mock
    private EscrowService escrowService;
    @InjectMocks
    private TaskLifecycleService service;

    private Task task;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        task = new Task();
        task.setId(1L);
        task.setCreatorId(100L);
        task.setStatus(TaskStatus.OPEN);
        task.setCreditReward(100);
        task.setExecutorId(null);
    }

    @Test
    void selectExecutor_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any())).thenAnswer(i->i.getArguments()[0]);
        Task updated = service.startTaskProgress(1L, 100L, 101L);
        assertEquals(TaskStatus.IN_PROGRESS, updated.getStatus());
        assertEquals(101L, updated.getExecutorId());
    }

    @Test
    void selectExecutor_wrongCreator() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        assertThrows(IllegalArgumentException.class,
                () -> service.startTaskProgress(1L, 555L, 101L));
    }

    @Test
    void cancelTask_refundCredits() {
        task.setStatus(TaskStatus.OPEN);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any())).thenAnswer(i->i.getArguments()[0]);
        Task cancelled = service.cancel(1L, 100L);
        assertEquals(TaskStatus.CANCELLED, cancelled.getStatus());
        verify(escrowService).refundToCreator(1L, 100L);
    }

    @Test
    void completeAndConfirm_flow_escrow() {
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setExecutorId(101L);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any())).thenAnswer(i->i.getArguments()[0]);
        // Исполнитель завершает:
        task.setStatus(TaskStatus.IN_PROGRESS); // сброс
        Task completed = service.markAsCompletedByExecutor(1L, 101L);
        assertEquals(TaskStatus.COMPLETED, completed.getStatus());
        // Заказчик подтверждает:
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        completed.setStatus(TaskStatus.COMPLETED);
        Task confirmed = service.confirmCompletedByCreator(1L, 100L);
        assertEquals(TaskStatus.COMPLETED, confirmed.getStatus());
        verify(escrowService).releaseToExecutor(1L, 101L);
    }
}
