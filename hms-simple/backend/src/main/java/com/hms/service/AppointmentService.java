package com.hms.service;

import com.hms.dto.AppointmentDto;

import java.util.List;

public interface AppointmentService {
    List<AppointmentDto> getAll();
    AppointmentDto getById(Long id);
    AppointmentDto create(AppointmentDto dto);
    AppointmentDto update(Long id, AppointmentDto dto);
    void cancel(Long id);
}
