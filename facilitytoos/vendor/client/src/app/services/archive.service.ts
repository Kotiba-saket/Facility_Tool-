import { Order } from './../models/Order';
import { Report } from './../models/Report';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  userid = localStorage.getItem("UserID");
  URL = environment.BaseURL;
  constructor(private http: HttpClient, private toastr: ToastrService) {}
/**
 * deze function voegt een Report to the archiveReports collection in de database
 * @param report report properties
 */
   moveReportToArchive(report){
     return this.http.post<Report>(this.URL + '/reportToArchive', report);
   }
/**
 * deze function voegt een Order to the archiveOrders collection in de database
 * @param report Order properties
 */
moveOrderToArchive(order){
  return this.http.post<Report>(this.URL + '/orderToArchive', order);
}

/**
 * get Alle gearchiveerde defecten
 */
getAllArchivedReports(){
  return this.http.get<Report[]>(this.URL + '/reportsFromArchive');
}

/**
 * get Alle gearchiveerde Orders
 */
getAllArchivedOrders(){
  return this.http.get<Order[]>(this.URL + '/ordersFromArchive');
}
/**
 * Deze functie gaat alle defecten ophalen waar de user op geabonneerd was
 */
getSubscribedReports(){
  return this.http.get<Report[]>(this.URL + `/findBySubscriber/${this.userid}`)
}
removeUserVote(report: Report, userId: string) {
  const userid = localStorage.getItem('UserID');
  console.log(userid);
  const body = {report, userId};

  this.http.put<Report>(this.URL + '/removeNotification', body).subscribe(result => {
    this.toastr.success('Gelukt!', 'Notificatie verwijderd.');
   });
}


}
