package com.trust.auth.service;

import com.trust.auth.dto.RegisterRequest;
import com.trust.auth.entity.User;
import com.trust.auth.entity.UserStatus;
import com.trust.auth.entity.VerificationToken;
import com.trust.auth.repository.UserRepository;
import com.trust.auth.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RegistrationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User register(RegisterRequest request) {
        // Проверка уникальности email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email уже используется");
        }

        // Создание пользователя
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user = userRepository.save(user);

        // Создание токена верификации (24 часа)
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserId(user.getId());
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        verificationToken.setCreatedAt(LocalDateTime.now());
        tokenRepository.save(verificationToken);

        // TODO: Отправка письма с подтверждением
        // TODO: Интеграция с profile модулем для создания профиля
        // TODO: Интеграция с credit модулем для начального баланса (100 кредитов)
        // TODO: Интеграция с reputation модулем для начального Trust Score (50)

        return user;
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Неверный токен верификации"));

        if (verificationToken.getUsedAt() != null) {
            throw new IllegalStateException("Токен уже использован");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Токен истек");
        }

        User user = userRepository.findById(verificationToken.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerifiedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        verificationToken.setUsedAt(LocalDateTime.now());
        tokenRepository.save(verificationToken);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь не найден"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new IllegalStateException("Email уже подтвержден");
        }

        // Удаляем старый токен, если есть
        tokenRepository.findByUserId(user.getId()).ifPresent(tokenRepository::delete);

        // Создаем новый токен
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserId(user.getId());
        verificationToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        verificationToken.setCreatedAt(LocalDateTime.now());
        tokenRepository.save(verificationToken);

        // TODO: Отправка письма с подтверждением
    }
}

