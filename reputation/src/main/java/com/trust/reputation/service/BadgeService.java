package com.trust.reputation.service;

import com.trust.reputation.entity.Badge;
import com.trust.reputation.entity.BadgeType;
import com.trust.reputation.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BadgeService {
    @Autowired
    private BadgeRepository badgeRepository;

    @Transactional
    public void checkAndAwardBadges(Long userId) {
        // FR6.4.1: Категории бейджей
        checkActivityBadges(userId);
        checkQualityBadges(userId);
        checkCommunityBadges(userId);
        checkSpecializationBadges(userId);
    }

    private void checkActivityBadges(Long userId) {
        // TODO: интеграция с task модулем для подсчета задач
        int completedTasks = 0; // placeholder
        int totalTransactions = 0; // placeholder

        if (completedTasks >= 1 && !hasBadge(userId, BadgeType.ACTIVITY, "Первая задача")) {
            awardBadge(userId, BadgeType.ACTIVITY, "Первая задача", "Выполнили свою первую задачу");
        }
        if (completedTasks >= 10 && !hasBadge(userId, BadgeType.ACTIVITY, "10 завершенных")) {
            awardBadge(userId, BadgeType.ACTIVITY, "10 завершенных", "Завершили 10 задач");
        }
        if (totalTransactions >= 100 && !hasBadge(userId, BadgeType.ACTIVITY, "100 транзакций")) {
            awardBadge(userId, BadgeType.ACTIVITY, "100 транзакций", "Провели 100 транзакций", true);
        }
    }

    private void checkQualityBadges(Long userId) {
        // TODO: проверка отзывов на "идеальные", скорость выполнения
    }

    private void checkCommunityBadges(Long userId) {
        // TODO: проверка помощи новичкам, активность в отзывах
    }

    private void checkSpecializationBadges(Long userId) {
        // TODO: проверка специализации по категориям задач
    }

    private boolean hasBadge(Long userId, BadgeType type, String name) {
        return badgeRepository.existsByUserIdAndTypeAndName(userId, type, name);
    }

    private void awardBadge(Long userId, BadgeType type, String name, String description) {
        awardBadge(userId, type, name, description, false);
    }

    private void awardBadge(Long userId, BadgeType type, String name, String description, boolean isRare) {
        Badge badge = new Badge();
        badge.setUserId(userId);
        badge.setType(type);
        badge.setName(name);
        badge.setDescription(description);
        badge.setIsRare(isRare);
        badge.setEarnedAt(java.time.LocalDateTime.now());
        badgeRepository.save(badge);
        // TODO: уведомление о новом бейдже (FR6.4.2)
    }

    public List<Badge> getUserBadges(Long userId) {
        return badgeRepository.findByUserId(userId);
    }
}

