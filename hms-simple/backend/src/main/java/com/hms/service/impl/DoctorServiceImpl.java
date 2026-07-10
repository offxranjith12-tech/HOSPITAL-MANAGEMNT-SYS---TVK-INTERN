package com.hms.service.impl;

import com.hms.dto.DoctorDto;
import com.hms.entity.Department;
import com.hms.entity.Doctor;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DepartmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DoctorDto> getAll() {
        return doctorRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDto getById(Long id) {
        return toDto(findEntity(id));
    }

    @Override
    public DoctorDto create(DoctorDto dto) {
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .department(resolveDepartment(dto.getDepartmentId()))
                .build();
        return toDto(doctorRepository.save(doctor));
    }

    @Override
    public DoctorDto update(Long id, DoctorDto dto) {
        Doctor doctor = findEntity(id);
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setDepartment(resolveDepartment(dto.getDepartmentId()));
        return toDto(doctorRepository.save(doctor));
    }

    @Override
    public void delete(Long id) {
        doctorRepository.delete(findEntity(id));
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) return null;
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + departmentId));
    }

    private Doctor findEntity(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    private DoctorDto toDto(Doctor doctor) {
        return DoctorDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .build();
    }
}
