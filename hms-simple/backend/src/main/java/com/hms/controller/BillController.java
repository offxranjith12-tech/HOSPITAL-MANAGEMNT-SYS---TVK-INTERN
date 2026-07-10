package com.hms.controller;

import com.hms.dto.BillDto;
import com.hms.service.BillService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@Tag(name = "Bills")
public class BillController {

    private final BillService billService;

    @PostMapping
    public ResponseEntity<BillDto> create(@Valid @RequestBody BillDto dto) {
        return ResponseEntity.ok(billService.create(dto));
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<BillDto>> getByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(billService.getByPatientId(patientId));
    }
}
