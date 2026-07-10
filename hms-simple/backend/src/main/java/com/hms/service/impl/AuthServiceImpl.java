package com.hms.service.impl;

import com.hms.dto.JwtResponse;
import com.hms.dto.LoginRequest;
import com.hms.dto.RegisterRequest;
import com.hms.entity.Role;
import com.hms.entity.RoleName;
import com.hms.entity.User;
import com.hms.exception.BadRequestException;
import com.hms.repository.RoleRepository;
import com.hms.repository.UserRepository;
import com.hms.security.JwtUtil;
import com.hms.security.UserPrincipal;
import com.hms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtil.generateToken(principal.getUsername());

        List<String> roles = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(token)
                .id(principal.getId())
                .username(principal.getUsername())
                .email(principal.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            roles.add(roleRepository.findByName(RoleName.ROLE_RECEPTIONIST)
                    .orElseThrow(() -> new BadRequestException("Default role not found")));
        } else {
            request.getRoles().forEach(r -> {
                RoleName roleName;
                try {
                    roleName = RoleName.valueOf(r);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role: " + r);
                }
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new BadRequestException("Role not found: " + r));
                roles.add(role);
            });
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        userRepository.save(user);
    }
}
