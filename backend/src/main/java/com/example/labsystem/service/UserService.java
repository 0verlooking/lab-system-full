package com.example.labsystem.service;

import com.example.labsystem.domain.user.User;
import com.example.labsystem.dto.request.RegisterRequest;

public interface UserService {
    User register(RegisterRequest request);
    User findByUsername(String username);
}
