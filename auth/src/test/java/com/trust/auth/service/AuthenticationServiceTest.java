package com.trust.auth.service;

import com.trust.auth.dto.AuthResponse;
import com.trust.auth.dto.LoginRequest;
import com.trust.auth.entity.User;
import com.trust.auth.entity.UserStatus;
import com.trust.auth.repository.UserRepository;
import com.trust.auth.repository.UserSessionRepository;
import com.trust.auth.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserSessionRepository sessionRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private AuthenticationService authenticationService;

    private User user;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setPasswordHash("encoded_password");
        user.setStatus(UserStatus.ACTIVE);
        user.setFailedLoginAttempts(0);

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");
    }

    @Test
    void login_success() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(jwtService.generateAccessToken(anyLong(), anyString())).thenReturn("access_token");
        when(jwtService.generateRefreshToken(anyLong(), anyString())).thenReturn("refresh_token");
        when(sessionRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        AuthResponse response = authenticationService.login(loginRequest, "127.0.0.1", "test-agent");

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("refresh_token", response.getRefreshToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_wrongPassword() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, 
            () -> authenticationService.login(loginRequest, "127.0.0.1", "test-agent"));
    }

    @Test
    void login_accountNotVerified() {
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        assertThrows(IllegalStateException.class,
            () -> authenticationService.login(loginRequest, "127.0.0.1", "test-agent"));
    }
}

