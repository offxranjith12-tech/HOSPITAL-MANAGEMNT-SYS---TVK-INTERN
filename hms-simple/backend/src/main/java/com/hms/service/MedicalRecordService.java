package com.hms.service;

import com.hms.dto.MedicalRecordDto;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDto create(MedicalRecordDto dto);
    List<MedicalRecordDto> getByPatientId(Long patientId);
}
