import { Observable } from 'rxjs';
import { ReportComment, ReportCommentData } from './../models/Report';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  URL = environment.BaseURL;
  contentHeaders: HttpHeaders;
  idToken: string;
  requestOptions;
  headerDict;
  constructor(private http: HttpClient) {
    this.idToken = localStorage.getItem('idToken');
    this.headerDict = {
      Authorization: 'Bearer ' + this.idToken,
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  /**
   * This method is responsible for communicating with the backend to add a new comment to a report
   * @param comment this is the comment to be added
   * @param reportId this is the id of the logged in user adding the comment
   * @param reportCommentData this is the comment body saved to the collection
   */
  addComment(
    comment: ReportComment,
    reportId,
    reportCommentData: ReportCommentData
  ) {
    comment.reportId = reportId;
    comment.reportCommentData.push(reportCommentData);

    return this.http.post(
      this.URL + '/comment/' + reportId,
      comment,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all comments on a report from the collection
   * It fetches all comments along with the people who made them
   * @param reportId this is the id of the report to be fetched
   */
  getComment(reportId) {
    return this.http.get<ReportComment>(
      this.URL + '/comment/' + reportId,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to update an existing comment
   * @param reportId this is the id of report which is getting its comment updated
   * @param index this is the position of the comment in the comment array
   * @param text this is the comment body
   */
  updateComment(reportId, index, text) {
    return this.http.patch(
      this.URL + '/comment/' + reportId + '/' + index + '?text=' + text,
      null,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to delete an existing comment
   * @param reportId this is the id of report which is getting its comment deleted
   * @param index this is the position of the comment in the comment array
   */
  deleteComment(reportId, index) {
    return this.http.delete(
      this.URL + '/comment/' + reportId + '/' + index,
      this.requestOptions
    );
  }
}
