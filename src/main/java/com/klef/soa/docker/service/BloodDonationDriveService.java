package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.entity.BloodDonationDrive;

public interface BloodDonationDriveService {

    BloodDonationDrive addBloodDonationDrive(BloodDonationDrive drive);

    List<BloodDonationDrive> displayAllBloodDonationDrives();

    BloodDonationDrive displayBloodDonationDriveById(Long id);

    BloodDonationDrive updateBloodDonationDrive(Long id, BloodDonationDrive drive);

    String deleteBloodDonationDrive(Long id);
}
