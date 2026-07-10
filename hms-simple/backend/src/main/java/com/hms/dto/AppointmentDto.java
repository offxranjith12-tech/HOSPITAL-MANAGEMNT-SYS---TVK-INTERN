package com.hms.dto;

import com.hms.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
    private Long id;

    @NotNull
    private Long doctorId;

    @NotNull
    private Long patientId;

    private String doctorName;
    private String patientName;

    @NotNull
    private LocalDateTime appointmentDateTime;

    private AppointmentStatus status;
    private String reason;
}
