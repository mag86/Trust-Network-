package com.trust.profile.repository;

import com.trust.profile.entity.Skill;
import com.trust.profile.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(Long userId);
    List<Skill> findByUserIdAndCategory(Long userId, SkillCategory category);
}

