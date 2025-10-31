package com.trust.task.bid;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByUserIdAndStatus(Long userId, BidStatus status);
    boolean existsByTaskIdAndUserIdAndStatus(Long taskId, Long userId, BidStatus status);
    int countByUserIdAndStatus(Long userId, BidStatus status);
}
