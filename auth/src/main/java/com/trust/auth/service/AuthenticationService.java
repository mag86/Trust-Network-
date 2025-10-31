package com.trust.auth.service;

import com.trust.auth.dto.AuthResponse;
import com.trust.auth.dto.LoginRequest;
import com.trust.auth.entity.User;
import com.trust.auth.entity.UserSession;
import com.trust.auth.entity.UserStatus;
import com.trust.auth.repository.UserRepository;
import com.trust.auth.repository.UserSessionRepository;
import com.trust.auth.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserSessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 30;

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Неверный email или пароль"));

        // Проверка блокировки (FR1.4.1)
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Аккаунт заблокирован до " + user.getLockedUntil());
        }

        // Проверка статуса
        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new IllegalStateException("Аккаунт заблокирован");
        }
        if (user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new IllegalStateException("Email не подтвержден");
        }

        // Проверка пароля
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw new IllegalArgumentException("Неверный email или пароль");
        }

        // Успешный вход - сброс счетчика попыток
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(ipAddress);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Генерация токенов (FR1.2.2)
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        // Создание сессии (FR1.2.3)
        UserSession session = new UserSession();
        session.setUser(user);
        session.setRefreshToken(refreshToken);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusDays(7));
        session.setLastUsedAt(LocalDateTime.now());
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setIsActive(true);
        sessionRepository.save(session);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());

        return response;
    }

    private void handleFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

        // Автоблокировка после 10 неудачных попыток (FR1.4.1)
        if (user.getFailedLoginAttempts() >= 10) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
            // TODO: Уведомление на email о блокировке
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Неверный refresh token");
        }

        UserSession session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Сессия не найдена"));

        if (!session.getIsActive() || session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Сессия истекла или неактивна");
        }

        User user = session.getUser();
        String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        session.setRefreshToken(newRefreshToken);
        session.setExpiresAt(LocalDateTime.now().plusDays(7));
        session.setLastUsedAt(LocalDateTime.now());
        sessionRepository.save(session);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(newRefreshToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());

        return response;
    }

    @Transactional
    public void logout(String refreshToken) {
        UserSession session = sessionRepository.findByRefreshToken(refreshToken)
                .orElse(null);
        if (session != null) {
            session.setIsActive(false);
            sessionRepository.save(session);
        }
    }

    public List<UserSession> getActiveSessions(Long userId) {
        return sessionRepository.findByUser_IdAndIsActiveTrue(userId);
    }

    @Transactional
    public void terminateSession(Long sessionId, Long userId) {
        UserSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Сессия не найдена"));
        if (!session.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Нельзя завершить чужую сессию");
        }
        session.setIsActive(false);
        sessionRepository.save(session);
    }

    @Transactional
    public void terminateAllSessions(Long userId) {
        List<UserSession> sessions = sessionRepository.findByUser_IdAndIsActiveTrue(userId);
        for (UserSession session : sessions) {
            session.setIsActive(false);
        }
        sessionRepository.saveAll(sessions);
    }
}

