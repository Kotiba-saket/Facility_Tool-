import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from 'src/app/models/Report';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class UpVoteService {

  URL = environment.BaseURL;
  public isGeaboneerd;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private toastr: ToastrService) { }


    /**
   * deze functie zal de data doorsturen naar de backend om deze aan te passen
   *
   */
  updateUserVote(report: Report, userId: string) {
    let subbed = false;

    console.log(subbed);
    const body = {report, userId};
    console.log(report.subscribers);
    report.subscribers.forEach(element => {
          if (element === userId) {
            subbed = true;
          }

        });
    if (subbed) {
          this.http.put<Report>(this.URL + '/unsubscribe', body).subscribe(result => {
          this.toastr.warning('Gelukt!', 'U bent gedeabonneerd.'); });
          report.upVote = +report.upVote - 1;
          report.subscribers.length = report.subscribers.length - 1;
          this.isGeaboneerd = false;

      } else {
        this.http.put<Report>(this.URL + '/subscribe', body).subscribe(result => {
        this.toastr.success('Bedankt !', 'U bent geabonneerd.'); });
        report.upVote = +report.upVote + 1;
        report.subscribers.length = report.subscribers.length + 1;
        report.subscribers.push(userId);
        this.isGeaboneerd = true;
        }
      }
  removeUserVote(report: Report) {
    const userid = localStorage.getItem('UserID');
    const body = {report, userid};

    this.http.put<Report>(this.URL + '/unsubscribe', body).subscribe(result => {
      this.toastr.success('Gelukt!', 'Notificatie verwijderd.');
      console.log(result); });
  }

}
