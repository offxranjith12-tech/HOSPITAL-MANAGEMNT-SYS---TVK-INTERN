package com.hms.service.impl;

import com.hms.dto.MedicalRecordDto;
import com.hms.entity.Appointment;
import com.hms.entity.MedicalRecord;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.MedicalRecordRepository;
import com.hms.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public MedicalRecordDto create(MedicalRecordDto dto) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + dto.getAppointmentId()));

        MedicalRecord record = MedicalRecord.builder()
                .appointment(appointment)
                .patient(appointment.getPatient())
                .diagnosis(dto.getDiagnosis())
                .prescription(dto.getPrescription())
                .notes(dto.getNotes())
                .build();

        return toDto(medicalRecordRepository.save(record));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalRecordDto> getByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    private MedicalRecordDto toDto(MedicalRecord r) {
        return MedicalRecordDto.builder()
                .id(r.getId())
                .appointmentId(r.getAppointment().getId())
                .patientId(r.getPatient().getId())
                .patientName(r.getPatient().getName())
                .diagnosis(r.getDiagnosis())
                .prescription(r.getPrescription())
                .notes(r.getNotes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
