package com.hms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordDto {
    private Long id;

    @NotNull
    private Long appointmentId;

    private Long patientId;
    private String patientName;

    private String diagnosis;
    private String prescription;
    private String notes;
    private LocalDateTime createdAt;
}
