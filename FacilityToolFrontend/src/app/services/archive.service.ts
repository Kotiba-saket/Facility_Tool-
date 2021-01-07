import { Order } from './../models/Order';
import { Report } from './../models/Report';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ArchiveService {
  userid = localStorage.getItem('UserID');
  URL = environment.BaseURL;
  idToken: string;
  requestOptions;
  headerDict;
  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.idToken = localStorage.getItem('idToken');
    this.headerDict = {
      Authorization: 'Bearer ' + this.idToken,
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  /**
   * This method is responsible for communicating with the backend to move a report to archive
   * @param report this is the report body to be moved to archive
   */
  moveReportToArchive(report) {
    return this.http.post<Report>(
      this.URL + '/report_archive',
      report,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to move an order to archive
   * @param report this is the order body to be moved to archive
   */
  moveOrderToArchive(order) {
    return this.http.post<Report>(
      this.URL + '/orderToArchive',
      order,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all archived reports
   */
  getAllArchivedReports() {
    return this.http.get<Report[]>(
      this.URL + '/report_archive',
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all archived orders
   */
  getAllArchivedOrders() {
    return this.http.get<Order[]>(
      this.URL + '/ordersFromArchive',
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all subscribed reports
   */
  getSubscribedReports() {
    return this.http.get<Report[]>(
      this.URL + `/report_archive/${this.userid}`,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to unsubscribe from a report
   * @param report this is the report to be unsubscribed from
   * @param userId this is the id of the logged in user doing the unsubscription
   */
  removeUserVote(report: Report, userId: string) {
    const userid = localStorage.getItem('UserID');
    const body = { report, userId };

    return this.http.put<Report>(
      this.URL + '/report_archive',
      body,
      this.requestOptions
    );
  }
}
