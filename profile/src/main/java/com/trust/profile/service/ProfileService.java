package com.trust.profile.service;

import com.trust.profile.dto.ProfileUpdateRequest;
import com.trust.profile.entity.ProfileHistory;
import com.trust.profile.entity.UserProfile;
import com.trust.profile.repository.ProfileHistoryRepository;
import com.trust.profile.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ProfileService {
    @Autowired
    private UserProfileRepository profileRepository;
    @Autowired
    private ProfileHistoryRepository historyRepository;

    @Transactional
    public UserProfile createOrUpdateProfile(Long userId, ProfileUpdateRequest request) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElse(new UserProfile());

        boolean isNew = profile.getId() == null;
        if (isNew) {
            profile.setUserId(userId);
            profile.setCreatedAt(LocalDateTime.now());
        }

        // Валидация уникальности displayName
        if (request.getDisplayName() != null) {
            if (profileRepository.existsByDisplayNameAndIdNot(request.getDisplayName(), profile.getId() != null ? profile.getId() : -1L)) {
                throw new IllegalArgumentException("Отображаемое имя уже занято");
            }
            if (!isNew && !profile.getDisplayName().equals(request.getDisplayName())) {
                saveHistory(profile.getUserId(), "displayName", profile.getDisplayName(), request.getDisplayName());
            }
            profile.setDisplayName(request.getDisplayName());
        }

        // Обновление остальных полей с сохранением истории
        updateFieldWithHistory(profile, "bio", profile.getBio(), request.getBio());
        updateFieldWithHistory(profile, "email", profile.getEmail(), request.getEmail());
        updateFieldWithHistory(profile, "telegram", profile.getTelegram(), request.getTelegram());
        updateFieldWithHistory(profile, "avatarUrl", profile.getAvatarUrl(), request.getAvatarUrl());
        updateFieldWithHistory(profile, "backgroundImageUrl", profile.getBackgroundImageUrl(), request.getBackgroundImageUrl());

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getTelegram() != null) profile.setTelegram(request.getTelegram());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getBackgroundImageUrl() != null) profile.setBackgroundImageUrl(request.getBackgroundImageUrl());
        if (request.getPrivacyLevel() != null) profile.setPrivacyLevel(request.getPrivacyLevel());

        profile.setUpdatedAt(LocalDateTime.now());

        // TODO: модерация контента на запрещенные слова
        // TODO: автоматическое обрезание изображений до 500x500px
        // TODO: валидация форматов и размеров файлов

        return profileRepository.save(profile);
    }

    private void updateFieldWithHistory(UserProfile profile, String fieldName, String oldValue, String newValue) {
        if (newValue != null && !newValue.equals(oldValue) && profile.getId() != null) {
            saveHistory(profile.getUserId(), fieldName, oldValue, newValue);
        }
    }

    private void saveHistory(Long userId, String fieldName, String oldValue, String newValue) {
        ProfileHistory history = new ProfileHistory();
        history.setUserId(userId);
        history.setFieldName(fieldName);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);
    }

    public UserProfile getProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Профиль не найден"));
    }

    @Transactional
    public void incrementViewCount(Long userId) {
        UserProfile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile != null) {
            profile.setViewCount(profile.getViewCount() + 1);
            profileRepository.save(profile);
        }
    }
}

