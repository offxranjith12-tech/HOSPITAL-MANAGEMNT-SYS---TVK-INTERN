package com.hms.controller;

import com.hms.dto.MedicalRecordDto;
import com.hms.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@Tag(name = "Medical Records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecordDto> create(@Valid @RequestBody MedicalRecordDto dto) {
        return ResponseEntity.ok(medicalRecordService.create(dto));
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<MedicalRecordDto>> getByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getByPatientId(patientId));
    }
}
