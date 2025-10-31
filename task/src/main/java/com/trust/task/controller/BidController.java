package com.trust.task.controller;

import com.trust.task.bid.Bid;
import com.trust.task.bid.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks/{taskId}/bids")
public class BidController {
    @Autowired
    private BidService bidService;

    @PostMapping
    public ResponseEntity<Bid> submitBid(@PathVariable Long taskId,
                                         @RequestParam Long userId,
                                         @RequestParam String message,
                                         @RequestParam(required = false) String portfolioUrl,
                                         @RequestParam(required = false) String proposedDeadline) {
        LocalDateTime deadline = proposedDeadline != null ? LocalDateTime.parse(proposedDeadline) : null;
        Bid bid = bidService.submitBid(userId, taskId, message, portfolioUrl, deadline);
        return ResponseEntity.ok(bid);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
