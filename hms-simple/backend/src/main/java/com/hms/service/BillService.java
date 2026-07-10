package com.hms.service;

import com.hms.dto.BillDto;

import java.util.List;

public interface BillService {
    BillDto create(BillDto dto);
    List<BillDto> getByPatientId(Long patientId);
}
