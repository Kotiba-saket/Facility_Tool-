package com.Faciltiy_Tool.facilitytoos.Controller;

import com.Faciltiy_Tool.facilitytoos.Repository.FacilityRepository;
import com.Faciltiy_Tool.facilitytoos.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * This class contains all API calls to the reports collection
 */
@RestController
@RequestMapping(path = "/api")
public class FacilityController {

    private final FacilityRepository repository;

    @Autowired
    public FacilityController(FacilityRepository repository) {
        this.repository = repository;
    }
    @Autowired
    private ObjectMapper objectMapper;

    /**
     * This method communicates directly with the mongodb database to fetch all reports
     * @return list of reports
     */
    @GetMapping("/report")
    public List<Report> getAllReports() {
        return repository.findAllByOrderByUpVoteDesc();
    }


    /**
     * This method communicates directly with the mongodb database to assign a report to an employee
     * @param body this is the report body with the updated assignTo property
     * @return assigned report
     */
    @PostMapping("/assign-report")
    public Report assignReportToEmployee(@RequestBody AssignReport body) {
        try {

            Report report = repository.findOneById(body.getReportId());
            report.setReporterId(body.getReporterId());
            User user = new User(body.getAssignTo().getId(), body.getAssignTo().getName());
            report.setAssignTo(user);
            repository.save(report);
            return report;

        } catch (Exception e) {
            return null;
        }


    }

    /**
     * This method communicates directly with the mongodb database to create a new report
     * @param image this is the image/picture of the defect to be reported
     * @param reportForm this is the rest of the report body from the client side
     * @return new report
     */
    @PostMapping("/report")
    public  Report saveReport(@RequestParam(value = "image", required = false) MultipartFile image,
                              @RequestParam(value = "report") String reportForm) {

        try {
            User azureUser = new User(null, null);
            ExternalFirms firm = new ExternalFirms(null, null, null, null);
            Report dto = objectMapper.readValue(reportForm, Report.class);
            dto.setAssignTo(azureUser);
            dto.setAssignToFirm(firm);


            if (image != null) {
                Report reportAd1 = new Report(dto.getReporterId(), dto.getReporterName(),dto.getTitle(), dto.getDescription(), dto.getLocation(), dto.isCloseTo(), dto.getCampus(),dto.getFloor(),
                        dto.getStatus(), dto.getPriority(),dto.getCategoryDepartment(), dto.getCategory(), image.getBytes(), dto.getAssignTo(), dto.getAssignToFirm());
                repository.save(reportAd1);
                return  reportAd1;
            } else {

                Report reportAd1 = new Report(dto.getReporterId(), dto.getReporterName(),dto.getTitle(), dto.getDescription(), dto.getLocation(), dto.isCloseTo(), dto.getCampus(),dto.getFloor(),
                        dto.getStatus(), dto.getPriority(),dto.getCategoryDepartment(), dto.getCategory(),  dto.getAssignTo(), dto.getAssignToFirm());
                repository.save(reportAd1);
                return  reportAd1;
            }
        } catch (Exception e) {

            return null;
        }

    }

    /**
     * This method communicates directly with the mongodb database to fetch a report based on id
     * @param id this is the id of the requested report
     * @return requested report
     */
    @GetMapping("/report/{id}")
    public Optional<Report> getReportsById(@PathVariable String id) {
        return repository.findById(id);
    }

    /**
     * This method communicates directly with the mongodb database to delete an existing report
     * A deleted report is moved to archives
     * @param id the id of the report to be deleted
     * @return true if successful
     */
    @DeleteMapping("/report/{id}")
    public Boolean deleteReport(@PathVariable String id) {
        if(id == null){
            return false;
        } else {
            repository.deleteById(id);
            return true;
        }

    }


    /**
     * This method communicates directly with the mongodb database to fetch reports made by a particular user
     * @param reporterId this is the id of user who made the report
     * @return list of reports
     */
    @GetMapping("/report-reportedBy/{reporterId}")
    public List<Report> getByReporterId(@PathVariable String reporterId) {
        return repository.findByReporterId(reporterId);
    }


    /**
     * This method communicates directly with the mongodb database to fetch reports assigned to the logged in user
     * @param userId this is the id of the logged in user
     * @return list of assigned reports
     */
    @GetMapping("/my-report/{userId}")
    public List<Report> myReports(@PathVariable String userId) {
        return repository.getAllByAssignToId(userId);
    }

    /**
     * This method communicates directly with the mongodb database to fetch reports a user has subscribed to
     * @param userId this is the id of the subscriber (user)
     * @return list of subscribed reports
     */
    @GetMapping("/report-bySubscriberId/{userId}")
    public List<Report> getAllBySubscribersContains(@PathVariable String userId) {
        return repository.getAllBySubscribersContains(userId);
    }

    /**
     * This method communicates directly with the mongodb database to update an existing report
     * @param id this is the id of the report to be updated
     * @param image this is the image file to be updated if changed
     * @param reportForm this is updated report body from the client side
     * @return updated report
     */
    @PutMapping("/report/{id}")
    public Report updateReport(@PathVariable String id, @RequestParam(value = "image", required = false) MultipartFile image, @RequestParam(value = "report") String reportForm)
    {
        Optional<Report> optionalReport = repository.findById(id);
        Report report;

        // Controleren of een report met de opgegeven id bestaat
        if (optionalReport.isPresent()) {
            report = optionalReport.get();
        } else {
            return null;
        }

        try {

            Report dto = objectMapper.readValue(reportForm, Report.class);

            // Indien een attribuut verschilt met het origineel object, update de attribuut
            if (!dto.getTitle().equals(report.getTitle())) {
                report.setTitle(dto.getTitle());
            }
            if (!dto.getDescription().equals(report.getDescription())) {
                report.setDescription(dto.getDescription());
            }
            if (!dto.getCampus().equals(report.getCampus())) {
                report.setCampus(dto.getCampus());
            }
            if (!dto.getLocation().equals(report.getLocation())) {
                report.setLocation(dto.getLocation());
            }
            if (dto.isCloseTo() != report.isCloseTo()) {
                report.setCloseTo(!report.isCloseTo());
            }
            if (!dto.getFloor().equals(report.getFloor())) {
                report.setFloor(dto.getFloor());
            }
            if (!dto.getCategory().equals(report.getCategory())) {
                report.setCategory(dto.getCategory());
            }
            if (!dto.getCategoryDepartment().equals(report.getCategoryDepartment())) {
                report.setCategoryDepartment(dto.getCategoryDepartment());
            }
            if (!dto.getPriority().equals(report.getPriority())) {
                report.setPriority(dto.getPriority());
            }
            if (!dto.getStatus().equals(report.getStatus())) {
                report.setStatus(dto.getStatus());
                report.getStatusHistory().add(dto.getStatus());
            }
            if (image != null) {
                report.setBytes(image.getBytes());
            }

            // Push de wijzigingen naar de database
            repository.save(report);

            return report;
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * This method communicates directly with the mongodb database to subscribe a user to a report
     * When a user subscribes to a report, the report subscription count (up-vote) increases by 1
     * @param body this the the report being subscribed to
     * @return http status OK
     */
    @PutMapping("/subscribe")
    public ResponseEntity<UpVote> addUpVoter(@RequestBody @Valid UpVote body) {

        try {

            String userId = body.getUserId();
            Report report = repository.findOneById(body.getReport().getId());
            report.addSubscriber(userId);
            report.setUpVote();

            if (body.getUserId() == null || body.getReport() == null){
                return new ResponseEntity<>(body,HttpStatus.BAD_REQUEST);
            } else {
                repository.save(report);
                return new ResponseEntity<>(HttpStatus.OK);
            }


        } catch (Exception e) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }

    /**
     * This method communicates directly with the mongodb database to unsubscribe from a report
     * When a user unsubscribes from a report, the subscription count (up-vote) decreases by 1
     * @param body this is the report the user is unsubscribing from
     * @return http status OK
     */
    @PutMapping("/unsubscribe")
    public ResponseEntity<UpVote> unsubscribe(@RequestBody UpVote body) {

        try {
            String userId = body.getUserId();
            Report report = repository.findOneById(body.getReport().getId());
            report.addSubscriber(userId);
            report.removeSubscriber(userId);
            report.setUpVote();
            repository.save(report);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }

    /**
     * This method communicates directly with the mongodb database to assign a report to an external firm
     * @param body this is the report body with the updated assignToFirm property
     * @return assigned report
     */
    @PostMapping("/assignFirm-report")
    public Report assignReportToFirm(@RequestBody AssignReport body) {
        try {
            Report report = repository.findOneById(body.getReportId());
            report.setReporterId(body.getReporterId());
            ExternalFirms firm = new ExternalFirms(body.getAssignToFirm().getEmail(), body.getAssignToFirm().getDisplayName(), body.getAssignToFirm().getTelefonNr(), null);
            report.setAssignToFirm(firm);
            repository.save(report);
            return report;
        } catch (Exception e) {
            return null;
        }

    }


}
