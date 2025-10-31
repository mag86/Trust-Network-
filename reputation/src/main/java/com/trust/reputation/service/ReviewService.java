package com.trust.reputation.service;

import com.trust.reputation.dto.ReviewCreateRequest;
import com.trust.reputation.entity.Review;
import com.trust.reputation.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public Review createReview(ReviewCreateRequest request, Long authorId, Long targetUserId) {
        // Проверка: 1 отзыв на задачу от каждой стороны
        if (reviewRepository.existsByTaskIdAndAuthorId(request.getTaskId(), authorId)) {
            throw new IllegalArgumentException("Вы уже оставили отзыв по этой задаче");
        }

        // Валидация оценок (0.0-5.0 с шагом 0.5)
        validateRating(request.getQualityRating());
        validateRating(request.getTimelinessRating());
        validateRating(request.getCommunicationRating());
        validateRating(request.getValueRating());

        // Расчет взвешенной общей оценки (FR6.1.1)
        double overallRating = calculateOverallRating(
                request.getQualityRating(),
                request.getTimelinessRating(),
                request.getCommunicationRating(),
                request.getValueRating()
        );

        Review review = new Review();
        review.setTaskId(request.getTaskId());
        review.setAuthorId(authorId);
        review.setTargetUserId(targetUserId);
        review.setQualityRating(request.getQualityRating());
        review.setTimelinessRating(request.getTimelinessRating());
        review.setCommunicationRating(request.getCommunicationRating());
        review.setValueRating(request.getValueRating());
        review.setOverallRating(overallRating);
        review.setPublicComment(request.getPublicComment());
        review.setPrivateComment(request.getPrivateComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setIsModerated(false);

        // TODO: проверка на спам и шаблонные отзывы
        // TODO: модерация на оскорбления

        return reviewRepository.save(review);
    }

    private void validateRating(Double rating) {
        if (rating < 0.0 || rating > 5.0) {
            throw new IllegalArgumentException("Оценка должна быть от 0.0 до 5.0");
        }
        // Проверка на шаг 0.5
        double step = rating % 0.5;
        if (step > 0.001 && step < 0.499) {
            throw new IllegalArgumentException("Оценка должна быть кратной 0.5");
        }
    }

    private double calculateOverallRating(double quality, double timeliness, double communication, double value) {
        return quality * 0.4 + timeliness * 0.3 + communication * 0.2 + value * 0.1;
    }

    @Transactional
    public Review editReview(Long reviewId, Long authorId, ReviewCreateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Отзыв не найден"));

        if (!review.getAuthorId().equals(authorId)) {
            throw new IllegalArgumentException("Нельзя редактировать чужой отзыв");
        }

        // Запрет редактирования после 24 часов (FR6.1.3)
        if (review.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Редактирование недоступно после 24 часов");
        }

        validateRating(request.getQualityRating());
        validateRating(request.getTimelinessRating());
        validateRating(request.getCommunicationRating());
        validateRating(request.getValueRating());

        double overallRating = calculateOverallRating(
                request.getQualityRating(),
                request.getTimelinessRating(),
                request.getCommunicationRating(),
                request.getValueRating()
        );

        review.setQualityRating(request.getQualityRating());
        review.setTimelinessRating(request.getTimelinessRating());
        review.setCommunicationRating(request.getCommunicationRating());
        review.setValueRating(request.getValueRating());
        review.setOverallRating(overallRating);
        review.setPublicComment(request.getPublicComment());
        review.setPrivateComment(request.getPrivateComment());
        review.setEditedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }
}

