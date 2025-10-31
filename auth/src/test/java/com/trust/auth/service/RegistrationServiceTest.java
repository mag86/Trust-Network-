package com.trust.auth.service;

import com.trust.auth.dto.RegisterRequest;
import com.trust.auth.entity.User;
import com.trust.auth.entity.UserStatus;
import com.trust.auth.repository.UserRepository;
import com.trust.auth.repository.VerificationTokenRepository;
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

class RegistrationServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private VerificationTokenRepository tokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private RegistrationService registrationService;

    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("Test1234");
        request.setDisplayName("TestUser");
    }

    @Test
    void register_success() {
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User user = registrationService.register(request);

        assertEquals(UserStatus.PENDING_VERIFICATION, user.getStatus());
        assertEquals("test@example.com", user.getEmail());
        verify(userRepository).save(any(User.class));
        verify(tokenRepository).save(any());
    }

    @Test
    void register_duplicateEmail() {
        when(userRepository.existsByEmail(any())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> registrationService.register(request));
    }
}

