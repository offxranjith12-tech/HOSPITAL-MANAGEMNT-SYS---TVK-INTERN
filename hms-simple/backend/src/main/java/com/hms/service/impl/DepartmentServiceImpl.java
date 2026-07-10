package com.hms.service.impl;

import com.hms.dto.DepartmentDto;
import com.hms.entity.Department;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DepartmentRepository;
import com.hms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> getAll() {
        return departmentRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDto getById(Long id) {
        return toDto(findEntity(id));
    }

    @Override
    public DepartmentDto create(DepartmentDto dto) {
        Department dep = Department.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toDto(departmentRepository.save(dep));
    }

    @Override
    public DepartmentDto update(Long id, DepartmentDto dto) {
        Department dep = findEntity(id);
        dep.setName(dto.getName());
        dep.setDescription(dto.getDescription());
        return toDto(departmentRepository.save(dep));
    }

    @Override
    public void delete(Long id) {
        Department dep = findEntity(id);
        departmentRepository.delete(dep);
    }

    private Department findEntity(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    private DepartmentDto toDto(Department dep) {
        return DepartmentDto.builder()
                .id(dep.getId())
                .name(dep.getName())
                .description(dep.getDescription())
                .build();
    }
}
