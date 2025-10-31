package com.trust.task.repository;

import com.trust.task.entity.Task;
import com.trust.task.entity.TaskCategory;
import com.trust.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    boolean existsByTitleAndCreatorId(String title, Long creatorId);

    @Query("SELECT t FROM Task t WHERE (:category IS NULL OR t.category = :category) " +
            "AND (:minCredit IS NULL OR t.creditReward >= :minCredit) " +
            "AND (:maxCredit IS NULL OR t.creditReward <= :maxCredit) " +
            "AND (:status IS NULL OR t.status = :status) " +
            "AND (:deadlineBefore IS NULL OR t.deadline <= :deadlineBefore)")
    Page<Task> searchWithFilters(
            @Param("category") TaskCategory category,
            @Param("minCredit") Integer minCredit,
            @Param("maxCredit") Integer maxCredit,
            @Param("status") TaskStatus status,
            @Param("deadlineBefore") String deadlineBefore,
            Pageable pageable);

    List<Task> findByDeadlineBeforeAndStatusIn(LocalDateTime date, List<TaskStatus> statuses);

    @Query("SELECT t FROM Task t WHERE t.status = 'OPEN' AND t.deadline <= :cut && SIZE((SELECT b FROM com.trust.task.bid.Bid b where b.taskId = t.id and b.status='ACTIVE')) = 0")
    List<Task> findOpenWithoutBidsBeforeDate(@Param("cut") LocalDateTime date);
}
