package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
}
