package com.hms.dto;

import com.hms.entity.BillStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillDto {
    private Long id;

    @NotNull
    private Long patientId;

    private String patientName;

    @NotNull
    private BigDecimal amount;

    private String description;
    private BillStatus status;
    private LocalDateTime billDate;
}
