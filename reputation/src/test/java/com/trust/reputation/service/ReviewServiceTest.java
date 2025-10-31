package com.trust.reputation.service;

import com.trust.reputation.dto.ReviewCreateRequest;
import com.trust.reputation.entity.Review;
import com.trust.reputation.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ReviewServiceTest {
    @Mock
    private ReviewRepository reviewRepository;
    @InjectMocks
    private ReviewService reviewService;

    private ReviewCreateRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new ReviewCreateRequest();
        request.setTaskId(1L);
        request.setQualityRating(4.5);
        request.setTimelinessRating(5.0);
        request.setCommunicationRating(4.0);
        request.setValueRating(4.5);
        request.setPublicComment("Great work!");
    }

    @Test
    void createReview_success() {
        when(reviewRepository.existsByTaskIdAndAuthorId(any(), any())).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenAnswer(i -> i.getArguments()[0]);
        
        Review review = reviewService.createReview(request, 1L, 2L);
        
        assertNotNull(review);
        assertEquals(4.5, review.getQualityRating());
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void createReview_duplicate() {
        when(reviewRepository.existsByTaskIdAndAuthorId(any(), any())).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> reviewService.createReview(request, 1L, 2L));
    }

    @Test
    void createReview_invalidRating() {
        request.setQualityRating(6.0); // Превышает максимум 5.0
        assertThrows(IllegalArgumentException.class, () -> reviewService.createReview(request, 1L, 2L));
    }
}

