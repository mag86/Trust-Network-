package com.trust.profile.controller;

import com.trust.profile.dto.SkillAddRequest;
import com.trust.profile.entity.Skill;
import com.trust.profile.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{userId}/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    @GetMapping
    public ResponseEntity<List<Skill>> getUserSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(skillService.getUserSkills(userId));
    }

    @PostMapping
    public ResponseEntity<Skill> addSkill(@PathVariable Long userId,
                                          @Valid @RequestBody SkillAddRequest request) {
        Skill skill = skillService.addSkill(userId, request);
        return ResponseEntity.ok(skill);
    }

    @DeleteMapping("/{skillId}")
    public ResponseEntity<Void> removeSkill(@PathVariable Long userId, @PathVariable Long skillId) {
        skillService.removeSkill(skillId, userId);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

