package com.trust.auth.service;

import com.trust.auth.dto.PasswordResetConfirmRequest;
import com.trust.auth.dto.PasswordResetRequest;
import com.trust.auth.entity.PasswordHistory;
import com.trust.auth.entity.PasswordResetToken;
import com.trust.auth.entity.User;
import com.trust.auth.repository.PasswordHistoryRepository;
import com.trust.auth.repository.PasswordResetTokenRepository;
import com.trust.auth.repository.UserRepository;
import com.trust.auth.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PasswordResetService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;
    @Autowired
    private PasswordHistoryRepository passwordHistoryRepository;
    @Autowired
    private UserSessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MAX_REQUESTS_PER_HOUR = 3;

    @Transactional
    public void requestPasswordReset(PasswordResetRequest request, String ipAddress) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email не найден"));

        // Ограничение запросов: 3 попытки в час (FR1.3.2)
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        List<PasswordResetToken> recentRequests = resetTokenRepository.findByUserIdAndCreatedAtAfter(
                user.getId(), oneHourAgo);
        if (recentRequests.size() >= MAX_REQUESTS_PER_HOUR) {
            throw new IllegalStateException("Слишком много запросов. Попробуйте позже.");
        }

        // Создание токена сброса пароля (1 час) (FR1.3.1)
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUserId(user.getId());
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1));
        resetToken.setCreatedAt(LocalDateTime.now());
        resetToken.setRequestedFromIp(ipAddress);
        resetTokenRepository.save(resetToken);

        // TODO: Отправка письма с ссылкой для сброса пароля
    }

    @Transactional
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Неверный токен сброса пароля"));

        if (resetToken.getUsedAt() != null) {
            throw new IllegalStateException("Токен уже использован");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Токен истек");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        // Проверка на повторное использование предыдущих паролей (FR1.3.2)
        String newPasswordHash = passwordEncoder.encode(request.getNewPassword());
        List<PasswordHistory> recentPasswords = passwordHistoryRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId());
        for (PasswordHistory history : recentPasswords) {
            if (passwordEncoder.matches(request.getNewPassword(), history.getPasswordHash())) {
                throw new IllegalArgumentException("Нельзя использовать предыдущий пароль");
            }
        }

        // Сохранение старого пароля в историю
        PasswordHistory history = new PasswordHistory();
        history.setUserId(user.getId());
        history.setPasswordHash(user.getPasswordHash());
        history.setCreatedAt(LocalDateTime.now());
        passwordHistoryRepository.save(history);

        // Обновление пароля
        user.setPasswordHash(newPasswordHash);
        user.setUpdatedAt(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        // Отметка токена как использованного
        resetToken.setUsedAt(LocalDateTime.now());
        resetTokenRepository.save(resetToken);

        // Автоматический выход со всех устройств (FR1.3.1)
        sessionRepository.findByUser_IdAndIsActiveTrue(user.getId())
                .forEach(session -> session.setIsActive(false));
        sessionRepository.saveAll(sessionRepository.findByUser_IdAndIsActiveTrue(user.getId()));

        // TODO: Уведомление на email о смене пароля (FR1.3.2)
    }
}

