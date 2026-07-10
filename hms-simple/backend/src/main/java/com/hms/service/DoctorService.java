package com.hms.service;

import com.hms.dto.DoctorDto;

import java.util.List;

public interface DoctorService {
    List<DoctorDto> getAll();
    DoctorDto getById(Long id);
    DoctorDto create(DoctorDto dto);
    DoctorDto update(Long id, DoctorDto dto);
    void delete(Long id);
}
