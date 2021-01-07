import { Category } from './../models/Report';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Status, Report, Priority } from '../models/Report';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  contentHeaders: HttpHeaders;
  URL = environment.BaseURL;
  userid = localStorage.getItem("UserID");
  userName = localStorage.getItem("UserName");

  constructor(private http: HttpClient)
  {
    this.contentHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');
  }

  /**
   * @returns Ontvang alle meldingen vanuit de server
   */
  getReports():Observable<Report[]>
  {
    return this.http.get<Report[]>(`${this.URL}/allReports`);
  }

  /**
   * Ontvang een report op basis van id
   * @param reportId
   */
  getReport(reportId:string)
  {
    return this.http.get<Report>(`${this.URL}/report/${reportId}`);
  }

  public createReport(report, selectedFile,username,userId) {

     report.reporterId = userId;
    report.reporterName = username;
    report.status = Status.OPEN;
    report.priority = Priority.LOW;

    console.log(selectedFile[0]);
    const fb = new FormData();
    fb.append('report', JSON.stringify(report));
    fb.append('image', selectedFile[0]);
    return this.http.post<Report>(this.URL + '/report', fb );
  }

  /**
   * Update een report op basis van id
   * @param report
   */
  updateReport(report:Report, selectedFile)
  {
    const fb = new FormData();

    fb.append('report', JSON.stringify(report));
    fb.append('image', selectedFile[0]);

    return this.http.put<Report>(this.URL + `/report/${report.id}`, fb);
  }

  getAllCategorie(){
    return this.http.get<Category[]>(this.URL + '/getAllCategory');
  }

  assignReportToEmplyee(assignedUser, reporterId, reportId) {
    const body = {
      assignTo: assignedUser,
      reporterId: reporterId,
      reportId: reportId
    }
    return this.http.post(this.URL + '/assignToEmployee', body);
  }

  getMyReports(userId: String) {
   return this.http.get<Report[]>(this.URL + '/byReporterId/' + userId);
  }

  getAssignToMeReports(){

    return this.http.get<Report[]>(this.URL + `/assignTo/${this.userid}`)
  }
  getSubscribedReports(){
    return this.http.get<Report[]>(this.URL + `/bySubscriberId/${this.userid}`)
  }

  /**
   * Delete Report from reports Collections
   */
  deleteReport(id) {
    return this.http.delete<Report>(this.URL + '/delete/' + id );
  }
}
