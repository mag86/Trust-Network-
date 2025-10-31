package com.trust.credit.repository;

import com.trust.credit.entity.Transaction;
import com.trust.credit.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromUserIdOrToUserIdOrderByTimestampDesc(Long fromUserId, Long toUserId);
    List<Transaction> findByType(TransactionType type);
    List<Transaction> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    List<Transaction> findByRelatedTaskId(Long taskId);
}

