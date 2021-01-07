import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Report } from 'src/app/models/Report';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UpVoteService {
  URL = environment.BaseURL;
  idToken: string;
  requestOptions;
  headerDict;
  public isGeaboneerd;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

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
   * This method is responsible for communicating with the backend to upvote an existing report
   * It checks if the logged in user has already subscribed to the report
   * If so, calling the method will unsubscribe the user from the report
   * If not, the user is subscribed to the report
   * After a subscription, the number of upvotes (priority) is increased by 1.
   * And after an unsubscription, the number of upvotes (priority) is decreased by 1.
   * @param report this is the report the user has subscribed or unsubscribed to
   * @param userId this is the id of the user
   */
  updateUserVote(report: Report, userId: string) {
    let subbed = false;

    const body = { report, userId };

    // tslint:disable-next-line:no-shadowed-variable
    report.subscribers.forEach((element) => {
      if (element === userId) {
        subbed = true;
      }
    });
    if (subbed) {
      this.http
        .put<Report>(this.URL + '/unsubscribe', body, this.requestOptions)
        .subscribe((result) => {
          this.toastr.warning('Gelukt!', 'U bent gedeabonneerd.');
        });
      report.upVote = +report.upVote - 1;
      report.subscribers.length = report.subscribers.length - 1;
      this.isGeaboneerd = false;
    } else {
      this.http
        .put<Report>(this.URL + '/subscribe', body, this.requestOptions)
        .subscribe((result) => {
          this.toastr.success('Bedankt !', 'U bent geabonneerd.');
        });
      report.upVote = +report.upVote + 1;
      report.subscribers.length = report.subscribers.length + 1;
      report.subscribers.push(userId);
      this.isGeaboneerd = true;
    }
  }

  /**
   * This method is responsible for communicating with the backend to downvote an existing report
   * @param report this is the report the user unsubscribe from
   */
  removeUserVote(report: Report) {
    const userid = localStorage.getItem('UserID');
    const body = { report, userid };

    this.http
      .put<Report>(this.URL + '/unsubscribe', body, this.requestOptions)
      .subscribe((result) => {
        this.toastr.success('Gelukt!', 'Notificatie verwijderd.');
      });
  }
}
