package com.trust.profile.dto;

import jakarta.validation.constraints.*;

public class TagAddRequest {
    @NotBlank
    @Size(max = 50)
    private String name;

    // getters/setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

