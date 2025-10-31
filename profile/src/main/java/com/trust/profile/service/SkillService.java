package com.trust.profile.service;

import com.trust.profile.dto.SkillAddRequest;
import com.trust.profile.entity.Skill;
import com.trust.profile.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {
    @Autowired
    private SkillRepository skillRepository;

    @Transactional
    public Skill addSkill(Long userId, SkillAddRequest request) {
        Skill skill = new Skill();
        skill.setUserId(userId);
        skill.setName(request.getName());
        skill.setCategory(request.getCategory());
        skill.setLevel(request.getLevel());
        skill.setVerificationType(request.getVerificationType());
        skill.setAddedAt(java.time.LocalDateTime.now());
        return skillRepository.save(skill);
    }

    public List<Skill> getUserSkills(Long userId) {
        return skillRepository.findByUserId(userId);
    }

    @Transactional
    public void removeSkill(Long skillId, Long userId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Навык не найден"));
        if (!skill.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нельзя удалить чужой навык");
        }
        skillRepository.delete(skill);
    }
}

