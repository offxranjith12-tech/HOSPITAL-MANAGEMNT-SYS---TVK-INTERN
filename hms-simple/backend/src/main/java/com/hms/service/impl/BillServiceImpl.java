package com.hms.service.impl;

import com.hms.dto.BillDto;
import com.hms.entity.Bill;
import com.hms.entity.BillStatus;
import com.hms.entity.Patient;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import com.hms.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    @Override
    public BillDto create(BillDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Bill bill = Bill.builder()
                .patient(patient)
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .status(dto.getStatus() != null ? dto.getStatus() : BillStatus.PENDING)
                .build();

        return toDto(billRepository.save(bill));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillDto> getByPatientId(Long patientId) {
        return billRepository.findByPatientId(patientId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    private BillDto toDto(Bill b) {
        return BillDto.builder()
                .id(b.getId())
                .patientId(b.getPatient().getId())
                .patientName(b.getPatient().getName())
                .amount(b.getAmount())
                .description(b.getDescription())
                .status(b.getStatus())
                .billDate(b.getBillDate())
                .build();
    }
}
