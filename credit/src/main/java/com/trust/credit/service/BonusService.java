package com.trust.credit.service;

import com.trust.credit.entity.BonusHistory;
import com.trust.credit.repository.BonusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BonusService {
    @Autowired
    private BonusHistoryRepository bonusRepository;
    @Autowired
    private CreditService creditService;

    private static final double REGISTRATION_BONUS = 100.0;
    private static final double VERIFICATION_BONUS = 50.0;
    private static final double INVITATION_BONUS = 25.0;
    private static final double FIRST_TASK_BONUS = 50.0;
    private static final double WEEKLY_ACTIVITY_BONUS = 10.0;

    @Transactional
    public void awardRegistrationBonus(Long userId) {
        if (!bonusRepository.existsByUserIdAndBonusType(userId, "REGISTRATION")) {
            creditService.addCredits(userId, REGISTRATION_BONUS);
            saveBonusHistory(userId, REGISTRATION_BONUS, "REGISTRATION", "Бонус за регистрацию");
        }
    }

    @Transactional
    public void awardVerificationBonus(Long userId) {
        if (!bonusRepository.existsByUserIdAndBonusType(userId, "VERIFICATION")) {
            creditService.addCredits(userId, VERIFICATION_BONUS);
            saveBonusHistory(userId, VERIFICATION_BONUS, "VERIFICATION", "Бонус за верификацию профиля");
        }
    }

    @Transactional
    public void awardInvitationBonus(Long userId) {
        creditService.addCredits(userId, INVITATION_BONUS);
        saveBonusHistory(userId, INVITATION_BONUS, "INVITATION", "Бонус за приглашение друга");
    }

    @Transactional
    public void awardFirstTaskBonus(Long userId) {
        if (!bonusRepository.existsByUserIdAndBonusType(userId, "FIRST_TASK")) {
            creditService.addCredits(userId, FIRST_TASK_BONUS);
            saveBonusHistory(userId, FIRST_TASK_BONUS, "FIRST_TASK", "Бонус за первую выполненную задачу");
        }
    }

    private void saveBonusHistory(Long userId, double amount, String type, String description) {
        BonusHistory history = new BonusHistory();
        history.setUserId(userId);
        history.setAmount(amount);
        history.setBonusType(type);
        history.setDescription(description);
        history.setAwardedAt(java.time.LocalDateTime.now());
        bonusRepository.save(history);
    }
}

