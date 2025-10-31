package com.trust.profile.dto;

import jakarta.validation.constraints.*;
import com.trust.profile.entity.SkillCategory;
import com.trust.profile.entity.SkillVerificationType;

public class SkillAddRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotNull
    private SkillCategory category;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer level;

    @NotNull
    private SkillVerificationType verificationType;

    // getters/setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public SkillVerificationType getVerificationType() { return verificationType; }
    public void setVerificationType(SkillVerificationType verificationType) { this.verificationType = verificationType; }
}

