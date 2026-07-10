package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDto {
    private Long id;

    @NotBlank
    private String name;

    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String email;
    private String address;
}
