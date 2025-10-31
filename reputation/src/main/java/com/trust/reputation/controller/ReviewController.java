package com.trust.reputation.controller;

import com.trust.reputation.dto.ReviewCreateRequest;
import com.trust.reputation.entity.Review;
import com.trust.reputation.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "API для системы оценок, отзывов и репутации")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@Valid @RequestBody ReviewCreateRequest request,
                                              @RequestParam Long authorId,
                                              @RequestParam Long targetUserId) {
        Review review = reviewService.createReview(request, authorId, targetUserId);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> editReview(@PathVariable Long reviewId,
                                             @RequestParam Long authorId,
                                             @Valid @RequestBody ReviewCreateRequest request) {
        Review review = reviewService.editReview(reviewId, authorId, request);
        return ResponseEntity.ok(review);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<String> handleBadRequest(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

