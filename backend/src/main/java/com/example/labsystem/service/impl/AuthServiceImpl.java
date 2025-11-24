package com.example.labsystem.service.impl;

import com.example.labsystem.domain.user.User;
import com.example.labsystem.dto.request.LoginRequest;
import com.example.labsystem.dto.request.RegisterRequest;
import com.example.labsystem.dto.response.AuthResponse;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.repository.UserRepository;
import com.example.labsystem.security.JwtService;
import com.example.labsystem.service.AuthService;
import com.example.labsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Реалізація сервісу аутентифікації.
 * Застосовує SOLID принципи:
 * - Single Responsibility: відповідає лише за аутентифікацію
 * - Dependency Inversion: використовує UserService та JwtService через інтерфейси
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public AuthResponse login(LoginRequest request) {
        // 1. знайти користувача
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 2. перевірити пароль
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // спеціально не говоримо «неправильний пароль», щоб не палити, чи є юзер
            throw new RuntimeException("Invalid credentials");
        }

        // 3. згенерувати JWT
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        // 4. повернути відповідь
        return new AuthResponse(token, user.getRole().name());
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // 1. Створити нового користувача через UserService
        User user = userService.register(request);

        // 2. Згенерувати JWT для нового користувача
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        // 3. Повернути відповідь
        return new AuthResponse(token, user.getRole().name());
    }
}
