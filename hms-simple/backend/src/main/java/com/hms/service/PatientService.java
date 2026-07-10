package com.hms.service;

import com.hms.dto.PatientDto;

import java.util.List;

public interface PatientService {
    List<PatientDto> getAll();
    PatientDto getById(Long id);
    PatientDto create(PatientDto dto);
    PatientDto update(Long id, PatientDto dto);
    void delete(Long id);
}
