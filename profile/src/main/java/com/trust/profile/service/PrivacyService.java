package com.trust.profile.service;

import com.trust.profile.dto.PrivacySettingsUpdateRequest;
import com.trust.profile.entity.PrivacySettings;
import com.trust.profile.repository.PrivacySettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrivacyService {
    @Autowired
    private PrivacySettingsRepository privacyRepository;

    @Transactional
    public PrivacySettings updatePrivacySettings(Long userId, PrivacySettingsUpdateRequest request) {
        PrivacySettings settings = privacyRepository.findByUserId(userId)
                .orElse(new PrivacySettings());

        if (settings.getId() == null) {
            settings.setUserId(userId);
        }

        if (request.getContactsVisibility() != null) {
            settings.setContactsVisibility(request.getContactsVisibility());
        }
        if (request.getTaskStatsVisibility() != null) {
            settings.setTaskStatsVisibility(request.getTaskStatsVisibility());
        }
        if (request.getReviewsVisibility() != null) {
            settings.setReviewsVisibility(request.getReviewsVisibility());
        }
        if (request.getLocationVisibility() != null) {
            settings.setLocationVisibility(request.getLocationVisibility());
        }

        return privacyRepository.save(settings);
    }

    public PrivacySettings getPrivacySettings(Long userId) {
        return privacyRepository.findByUserId(userId)
                .orElse(new PrivacySettings()); // По умолчанию все видно
    }
}

