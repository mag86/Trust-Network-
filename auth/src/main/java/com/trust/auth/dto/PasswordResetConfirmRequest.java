package com.trust.auth.dto;

import jakarta.validation.constraints.*;

public class PasswordResetConfirmRequest {
    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 8)
    @Pattern(regexp = ".*[A-Z].*", message = "Пароль должен содержать хотя бы одну заглавную букву")
    @Pattern(regexp = ".*[0-9].*", message = "Пароль должен содержать хотя бы одну цифру")
    private String newPassword;

    // getters/setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}

