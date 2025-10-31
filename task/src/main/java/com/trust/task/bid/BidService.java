package com.trust.task.bid;

import com.trust.task.entity.Task;
import com.trust.task.entity.TaskStatus;
import com.trust.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private TaskRepository taskRepository;

    public Bid submitBid(Long userId, Long taskId, String message, String portfolioUrl, java.time.LocalDateTime proposedDeadline) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Задача не найдена"));
        if(task.getCreatorId().equals(userId)) {
            throw new IllegalArgumentException("Нельзя подавать заявку к своей задаче");
        }
        if(task.getStatus() != TaskStatus.OPEN) {
            throw new IllegalArgumentException("Заявки принимаются только по открытым задачам");
        }
        if(bidRepository.existsByTaskIdAndUserIdAndStatus(taskId, userId, BidStatus.ACTIVE)) {
            throw new IllegalArgumentException("У вас уже есть активная заявка по этой задаче");
        }
        if(bidRepository.countByUserIdAndStatus(userId, BidStatus.ACTIVE) >= 10) {
            throw new IllegalArgumentException("Максимум 10 активных заявок одновременно");
        }
        Bid bid = new Bid();
        bid.setUserId(userId);
        bid.setTaskId(taskId);
        bid.setMessage(message);
        bid.setPortfolioUrl(portfolioUrl);
        bid.setProposedDeadline(proposedDeadline);
        bid.setStatus(BidStatus.ACTIVE);
        return bidRepository.save(bid);
    }

    // Методы для approve/reject cancel и уведомление здесь
}
