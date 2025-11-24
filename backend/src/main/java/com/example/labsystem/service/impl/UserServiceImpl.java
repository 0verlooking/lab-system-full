package com.example.labsystem.service.impl;

import com.example.labsystem.domain.user.User;
import com.example.labsystem.domain.user.UserRole;
import com.example.labsystem.dto.request.RegisterRequest;
import com.example.labsystem.exception.AlreadyExistsException;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.repository.UserRepository;
import com.example.labsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Реалізація сервісу для роботи з користувачами.
 * Застосовує SOLID принципи:
 * - Single Responsibility: відповідає лише за бізнес-логіку користувачів
 * - Dependency Inversion: залежить від абстракцій (UserRepository, PasswordEncoder)
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        // Перевірка чи не існує вже такий користувач
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AlreadyExistsException("User with username '" + request.getUsername() + "' already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.STUDENT);

        return userRepository.save(user);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found: " + username));
    }
}
