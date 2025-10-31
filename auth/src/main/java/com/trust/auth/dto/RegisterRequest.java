package com.trust.auth.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8)
    @Pattern(regexp = ".*[A-Z].*", message = "Пароль должен содержать хотя бы одну заглавную букву")
    @Pattern(regexp = ".*[0-9].*", message = "Пароль должен содержать хотя бы одну цифру")
    private String password;

    @NotBlank
    @Size(min = 2, max = 50)
    private String displayName;

    // getters/setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}

