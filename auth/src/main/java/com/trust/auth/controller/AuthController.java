package com.trust.auth.controller;

import com.trust.auth.dto.*;
import com.trust.auth.entity.User;
import com.trust.auth.entity.UserSession;
import com.trust.auth.service.AuthenticationService;
import com.trust.auth.service.PasswordResetService;
import com.trust.auth.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "API для аутентификации, регистрации и управления аккаунтом")
public class AuthController {
    @Autowired
    private RegistrationService registrationService;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    @Operation(summary = "Регистрация нового пользователя", description = "Создание нового аккаунта с начальным балансом и профилем")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User user = registrationService.register(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        registrationService.verifyEmail(token);
        return ResponseEntity.ok("Email успешно подтвержден");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam String email) {
        registrationService.resendVerificationEmail(email);
        return ResponseEntity.ok("Письмо с подтверждением отправлено");
    }

    @PostMapping("/login")
    @Operation(summary = "Вход в систему", description = "Аутентификация пользователя и получение JWT токенов")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                             HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        AuthResponse response = authenticationService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        AuthResponse response = authenticationService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam String refreshToken) {
        authenticationService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password-reset")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request,
                                                       HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        passwordResetService.requestPasswordReset(request, ipAddress);
        return ResponseEntity.ok("Ссылка для сброса пароля отправлена на email");
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<String> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.confirmPasswordReset(request);
        return ResponseEntity.ok("Пароль успешно изменен");
    }

    @GetMapping("/sessions/{userId}")
    public ResponseEntity<List<UserSession>> getActiveSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(authenticationService.getActiveSessions(userId));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> terminateSession(@PathVariable Long sessionId,
                                                   @RequestParam Long userId) {
        authenticationService.terminateSession(sessionId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/sessions/all/{userId}")
    public ResponseEntity<Void> terminateAllSessions(@PathVariable Long userId) {
        authenticationService.terminateAllSessions(userId);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<String> handleBadRequest(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

