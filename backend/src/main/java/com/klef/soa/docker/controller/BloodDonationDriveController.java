package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.entity.BloodDonationDrive;
import com.klef.soa.docker.service.BloodDonationDriveService;

@CrossOrigin("*")
@RestController
@RequestMapping("/blooddonationdrive")
public class BloodDonationDriveController {

    private final BloodDonationDriveService service;

    public BloodDonationDriveController(BloodDonationDriveService service) {
        this.service = service;
    }

    @Value("${server.port}")
    private String port;

    @GetMapping("/")
    public String home() {
        return "CRUD Service is running";
    }

    @GetMapping("/instance")
    public String instance() {
        return "CRUD Service Project is running on port: " + port;
    }

    @PostMapping("/add")
    public ResponseEntity<BloodDonationDrive> addBloodDonationDrive(
            @RequestBody BloodDonationDrive drive) {

        BloodDonationDrive savedDrive = service.addBloodDonationDrive(drive);

        return new ResponseEntity<>(savedDrive, HttpStatus.CREATED);
    }

    @GetMapping("/displayAll")
    public ResponseEntity<List<BloodDonationDrive>> displayAll() {
        return ResponseEntity.ok(service.displayAllBloodDonationDrives());
    }

    @GetMapping("/display/{id}")
    public ResponseEntity<?> displayById(@PathVariable Long id) {
        try {
            BloodDonationDrive drive = service.displayBloodDonationDriveById(id);
            return ResponseEntity.ok(drive);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Blood Donation Drive ID " + id + " not found");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody BloodDonationDrive drive) {
        try {
            BloodDonationDrive updatedDrive =
                    service.updateBloodDonationDrive(id, drive);
            return ResponseEntity.ok(updatedDrive);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Blood Donation Drive ID " + id + " not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        return ResponseEntity.ok(service.deleteBloodDonationDrive(id));
    }
}