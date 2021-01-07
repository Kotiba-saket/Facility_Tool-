package com.Faciltiy_Tool.facilitytoos.Controller;

import com.Faciltiy_Tool.facilitytoos.Repository.ArchiveReportsRepository;
import com.Faciltiy_Tool.facilitytoos.model.ArchiveReports;
import com.Faciltiy_Tool.facilitytoos.model.UpVote;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * This class contains all API calls to the report archive
 */
@RestController
@RequestMapping(path = "/api")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ArchiveReportController {

    private final ArchiveReportsRepository archiveReportsRepository;
    public ArchiveReportController(ArchiveReportsRepository archiveReportsRepository) {
        this.archiveReportsRepository = archiveReportsRepository;
    }




    /**
     * This method communicates directly with the mongodb database to move a report to the archive collection
     * @param reportToarchive object body of the report being moved to archive collection
     * @return  null
     */
    @PostMapping("/report_archive")
    public ArchiveReports addReportToArchive(@RequestBody  ArchiveReports reportToarchive){
        try {
          archiveReportsRepository.save(reportToarchive);
            return reportToarchive;
        } catch (Exception ex){
            return  null;
        }

    }

    /**
     * This method communicates directly with the mongodb database to fetch all reports that have been moved to archive
     * @return a list of reports inside the archivereports collection
     */
    @GetMapping("/report_archive")
    public List<ArchiveReports> getAllReportsFromArchive(){
        return archiveReportsRepository.findAll();
    }

    /**
     * This method communicates directly with the mongodb database to fetch all subscribed reports that have been moved to archive
     * @param userId this is the id of the user who made the subscription
     * @return lijst van geabonneerde op een bepaalde defect
     */
    @GetMapping("/report_archive/{userId}")
    public List<ArchiveReports> getAllBySubscribersContains(@PathVariable String userId) {
        return archiveReportsRepository.getAllBySubscribersContains(userId);
    }

    /**
     * This method notifies the user after a successful unsubscription from a report
     * @param body this is the notification body
     * @return http status OK
     */
    @PutMapping("/report_archive")
    public ResponseEntity<UpVote> removeNotification(@RequestBody UpVote body) {

        try {
            String userId = body.getUserId();
            ArchiveReports report = archiveReportsRepository.findOneById(body.getReport().getId());
            report.removeSubscriber(userId);
            archiveReportsRepository.save(report);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


    }
}