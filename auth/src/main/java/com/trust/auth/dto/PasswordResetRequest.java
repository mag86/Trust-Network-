package com.trust.auth.dto;

import jakarta.validation.constraints.*;

public class PasswordResetRequest {
    @NotBlank
    @Email
    private String email;

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

