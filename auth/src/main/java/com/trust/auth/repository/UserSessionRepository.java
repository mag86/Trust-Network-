package com.trust.auth.repository;

import com.trust.auth.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUser_IdAndIsActiveTrue(Long userId);
    Optional<UserSession> findByRefreshToken(String refreshToken);
}

