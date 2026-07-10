package com.hms.service;

import com.hms.dto.DepartmentDto;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDto> getAll();
    DepartmentDto getById(Long id);
    DepartmentDto create(DepartmentDto dto);
    DepartmentDto update(Long id, DepartmentDto dto);
    void delete(Long id);
}
