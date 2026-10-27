package com.klef.soa.docker.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.klef.soa.docker.entity.BloodDonationDrive;
import com.klef.soa.docker.repository.BloodDonationDriveRepository;
import com.klef.soa.docker.service.BloodDonationDriveService;

@Service
public class BloodDonationDriveServiceImpl implements BloodDonationDriveService {

    private final BloodDonationDriveRepository repository;

    public BloodDonationDriveServiceImpl(BloodDonationDriveRepository repository) {
        this.repository = repository;
    }

    @Override
    public BloodDonationDrive addBloodDonationDrive(BloodDonationDrive drive) {
        drive.setId(null);
        return repository.save(drive);
    }

    @Override
    public List<BloodDonationDrive> displayAllBloodDonationDrives() {
        return repository.findAll();
    }

    @Override
    public BloodDonationDrive displayBloodDonationDriveById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Blood Donation Drive ID not found: " + id));
    }

    @Override
    public BloodDonationDrive updateBloodDonationDrive(Long id, BloodDonationDrive updatedDrive) {
        BloodDonationDrive drive = displayBloodDonationDriveById(id);

        drive.setDriveName(updatedDrive.getDriveName());
        drive.setVenue(updatedDrive.getVenue());
        drive.setDonorCount(updatedDrive.getDonorCount());
        drive.setCompleted(updatedDrive.getCompleted());

        return repository.save(drive);
    }

    @Override
    public String deleteBloodDonationDrive(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "Blood Donation Drive Deleted Successfully";
        }

        throw new RuntimeException("Blood Donation Drive ID not found: " + id);
    }
}
