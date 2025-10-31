package com.trust.reputation.repository;

import com.trust.reputation.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetUserId(Long targetUserId);
    Optional<Review> findByTaskIdAndAuthorId(Long taskId, Long authorId);
    boolean existsByTaskIdAndAuthorId(Long taskId, Long authorId);
}

