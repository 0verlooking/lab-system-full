package com.example.labsystem.service;

import com.example.labsystem.dto.request.LoginRequest;
import com.example.labsystem.dto.request.RegisterRequest;
import com.example.labsystem.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
