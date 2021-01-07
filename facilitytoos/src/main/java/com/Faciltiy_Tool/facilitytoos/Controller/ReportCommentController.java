package com.Faciltiy_Tool.facilitytoos.Controller;
import com.Faciltiy_Tool.facilitytoos.Repository.ReportCommentRepository;
import com.Faciltiy_Tool.facilitytoos.model.ReportComment;
import com.Faciltiy_Tool.facilitytoos.model.ReportCommentData;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * This controller class is responsible for adding, updating and deleting comments on reports
 *
 * @author team8-tryCatchUs
 */
@RestController
@RequestMapping(path = "/api")
public class ReportCommentController {

    private ReportCommentRepository repository;

    public ReportCommentController(ReportCommentRepository repository) {
        this.repository = repository;
    }

    /**
     * This method communicates directly with the mongodb database to add comment to a report
     * @param reportId this is the id of the report being commented on
     * @param comment this is the comment body from the client side
     * @return comment
     */
    @PostMapping("/comment/{reportId}")
    public ReportComment addComment(@PathVariable String reportId, @RequestBody ReportComment comment){
         ReportComment comment1 = repository.findCommentByReportId(reportId);
            if(comment1 == null){

                return repository.save(comment);
            } else {
                List<ReportCommentData> reportCommentData = comment1.getReportCommentData();
                List<ReportCommentData> commentFromclient = comment.getReportCommentData();
                reportCommentData.add(commentFromclient.get(commentFromclient.size() - 1));
                return repository.save(comment1);
            }

    }

    /**
     * This method communicates directly with the mongodb database to fetch all comments on a report
     * @param reportId this is the id of the report
     * @return comments
     */
    @GetMapping("/comment/{reportId}")
    public ReportComment comment(@PathVariable("reportId") String reportId){
         return repository.findCommentByReportId(reportId);

    }

    /**
     * This method communicates directly with the mongodb database to update an existing comment
     * @param reportId this is the id of the report whose comment is being updated
     * @param index this is the position of the comment since the comments are saved in an array
     * @param text this is the updated comment body from the client side
     * @return updated comment
     */
    @PatchMapping("/comment/{reportId}/{index}")
    public ReportComment updateComment(@PathVariable String reportId, @PathVariable  int index , String text){
        ReportComment comment1 = repository.findCommentByReportId(reportId);

            List<ReportCommentData> reportCommentData = comment1.getReportCommentData();

            ReportCommentData data = reportCommentData.get(index);
             data.setText(text);
             repository.save(comment1);
            return comment1;

    }
    /**
     * This method communicates directly with the mongodb database to delete an existing comment
     * @param reportId this is the id of the report to be deleted
     * @param index this is the position of the comment to be deleted inside the comments array
     * @return comments left in the array
     */
    @DeleteMapping("/comment/{reportId}/{index}")
    public ReportComment deleteComment(@PathVariable String reportId, @PathVariable  int index ){
        ReportComment comment1 = repository.findCommentByReportId(reportId);
        List<ReportCommentData> reportCommentData = comment1.getReportCommentData();
            reportCommentData.remove(index);
        return repository.save(comment1);
    }
}
