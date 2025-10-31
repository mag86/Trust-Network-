package com.trust.task.bid;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Bid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Long taskId;
    @Column(nullable = false, length = 500)
    private String message;
    private LocalDateTime proposedDeadline;
    private String portfolioUrl;
    @Enumerated(EnumType.STRING)
    private BidStatus status = BidStatus.ACTIVE;
    private LocalDateTime createdAt = LocalDateTime.now();
    // getters/setters
}
