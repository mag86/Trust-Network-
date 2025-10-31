package com.trust.profile.service;

import com.trust.profile.dto.ProfileUpdateRequest;
import com.trust.profile.entity.UserProfile;
import com.trust.profile.repository.ProfileHistoryRepository;
import com.trust.profile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProfileServiceTest {
    @Mock
    private UserProfileRepository profileRepository;
    @Mock
    private ProfileHistoryRepository historyRepository;
    @InjectMocks
    private ProfileService profileService;

    private ProfileUpdateRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new ProfileUpdateRequest();
        request.setDisplayName("NewName");
        request.setBio("Test bio");
    }

    @Test
    void createOrUpdateProfile_success() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(profileRepository.existsByDisplayNameAndIdNot(any(), any())).thenReturn(false);
        when(profileRepository.save(any(UserProfile.class))).thenAnswer(i -> i.getArguments()[0]);
        
        UserProfile profile = profileService.createOrUpdateProfile(1L, request);
        
        assertNotNull(profile);
        assertEquals("NewName", profile.getDisplayName());
        verify(profileRepository).save(any(UserProfile.class));
    }

    @Test
    void createOrUpdateProfile_duplicateDisplayName() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(profileRepository.existsByDisplayNameAndIdNot(any(), any())).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> profileService.createOrUpdateProfile(1L, request));
    }
}

