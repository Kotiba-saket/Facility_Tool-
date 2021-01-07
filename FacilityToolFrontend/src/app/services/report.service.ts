import { Category } from './../models/Report';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status, Report, Priority } from '../models/Report';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  contentHeaders: HttpHeaders;
  URL = environment.BaseURL;
  userid = localStorage.getItem('UserID');
  userName = localStorage.getItem('UserName');
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
   * This method communicates directly with the backend to fetch all orders from the orders collection
   */
  getReports() {
    return this.http.get<Report[]>(`${this.URL}/report`, this.requestOptions);
  }

  /**
   * This method communicates directly with the backend to fetch one report
   * from the reports collection based on the given id
   * @param reportId this is the id of the order to be fetched
   */
  getReport(reportId: string) {
    return this.http.get<Report>(
      `${this.URL}/report/${reportId}`,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to make creation of a report possible
   * This method needs four parameters to be able to carry out its function
   * The report body is sent as a json file to the backend
   * @param report this is the report body
   * @param selectedFile this is the image file
   * @param username this is the name of the reporter
   * @param userId this is the id of the reporter
   */
  public createReport(report, selectedFile, username, userId) {
    report.reporterId = userId;
    report.reporterName = username;
    report.status = Status.OPEN;
    report.priority = Priority.LOW;
    const fb = new FormData();
    fb.append('report', JSON.stringify(report));
    fb.append('image', selectedFile[0]);
    return this.http.post<Report>(
      this.URL + '/report',
      fb,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to update an existing report
   * The report body is sent as json object and only one parameter is needed
   * @param selectedFile this is the image file to be updated
   * @param report this is the report to be updated
   */
  updateReport(report: Report, selectedFile) {
    const fb = new FormData();

    fb.append('report', JSON.stringify(report));
    fb.append('image', selectedFile[0]);

    return this.http.put<Report>(
      this.URL + `/report/${report.id}`,
      fb,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to assign an order to an employee
   * The report body comprises of the user to be assigned, the id of the reporter and the id of the report
   * @param assignedUser this is the user to be assigned to the report
   * @param reporterId this is the id of the person who made the report
   * @param reportId this is the id of the report
   */
  assignReportToEmplyee(assignedUser, reporterId, reportId) {
    const body = {
      assignTo: assignedUser,
      reporterId,
      reportId,
    };
    return this.http.post(
      this.URL + '/assign-report',
      body,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to assign a report to an external firm
   * The report body comprises of the firm to be assigned, the id of the reporter and the id of the report
   * @param assignedFirm this is the firm to be assigned to the report
   * @param reporterId this is the id of the person who made the report
   * @param reportId this is the id of the report being assigned
   */
  assignReportToFirm(assignedFirm, reporterId, reportId) {
    const body = {
      assignToFirm: assignedFirm,
      reporterId,
      reportId,
    };
    return this.http.post(
      this.URL + '/assignFirm-report',
      body,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all reports made by the logged in user
   * @param userId this is the id of the currently logged in user
   */
  getMyReports(userId: string) {
    return this.http.get<Report[]>(
      this.URL + '/report-reportedBy/' + userId,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all reports that have been assigned to
   * the currently logged in user
   */
  getAssignToMeReports() {
    return this.http.get<Report[]>(
      this.URL + '/my-report/' + this.userid,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all reports the current user has subscribed to
   */
  getSubscribedReports() {
    return this.http.get<Report[]>(
      this.URL + `/report-bySubscriberId/${this.userid}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch delete a report from the collection
   * @param id the id of the report to be deleted
   */
  deleteReport(id) {
    return this.http.delete<Report>(
      this.URL + '/report/' + id,
      this.requestOptions
    );
  }
}
