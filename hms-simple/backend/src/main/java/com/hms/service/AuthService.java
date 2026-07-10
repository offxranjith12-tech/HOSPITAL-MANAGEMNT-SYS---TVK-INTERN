package com.hms.service;

import com.hms.dto.JwtResponse;
import com.hms.dto.LoginRequest;
import com.hms.dto.RegisterRequest;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    void register(RegisterRequest request);
}
