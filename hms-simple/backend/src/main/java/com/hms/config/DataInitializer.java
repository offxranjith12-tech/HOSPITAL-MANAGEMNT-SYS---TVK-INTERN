package com.hms.config;

import com.hms.entity.Role;
import com.hms.entity.RoleName;
import com.hms.entity.User;
import com.hms.repository.RoleRepository;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Seeds default roles and a default admin user on first startup.
 * Default admin credentials: username=admin / password=Admin@123
 * CHANGE THESE IMMEDIATELY after first login in a real deployment.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName).orElseGet(() ->
                    roleRepository.save(Role.builder().name(roleName).build()));
        }

        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseThrow();
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User admin = User.builder()
                    .fullName("System Administrator")
                    .username("admin")
                    .email("admin@hms.local")
                    .password(passwordEncoder.encode("Admin@123"))
                    .roles(roles)
                    .build();
            userRepository.save(admin);
        }
    }
}
