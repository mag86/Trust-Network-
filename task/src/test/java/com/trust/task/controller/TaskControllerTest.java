package com.trust.task.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trust.task.dto.TaskCreateRequest;
import com.trust.task.entity.TaskCategory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private com.trust.task.service.TaskService taskService;

    @Test
    void successCreateTask() throws Exception {
        TaskCreateRequest req = new TaskCreateRequest();
        req.setTitle("Помочь с переездом");
        req.setDescription("Нужна помощь вынести мебель");
        req.setCategory(TaskCategory.WORK);
        req.setCreditReward(100);

        when(taskService.createTask(any(), eq(1L), eq(100))).thenReturn(new com.trust.task.entity.Task());

        mockMvc.perform(post("/api/tasks?userId=1&userBalance=100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void createTaskLowBalance() throws Exception {
        TaskCreateRequest req = new TaskCreateRequest();
        req.setTitle("some");
        req.setDescription("desc");
        req.setCategory(TaskCategory.OTHER);
        req.setCreditReward(50);
        when(taskService.createTask(any(), eq(1L), eq(5)))
                .thenThrow(new IllegalArgumentException("Недостаточно кредитов для создания задачи"));
        mockMvc.perform(post("/api/tasks?userId=1&userBalance=5")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTaskValidationErrors() throws Exception {
        TaskCreateRequest req = new TaskCreateRequest();
        req.setTitle("");
        req.setDescription("");
        req.setCategory(null);
        req.setCreditReward(5);
        mockMvc.perform(post("/api/tasks?userId=1&userBalance=100")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
