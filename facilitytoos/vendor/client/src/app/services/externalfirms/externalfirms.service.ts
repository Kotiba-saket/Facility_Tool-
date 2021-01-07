import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExternalFirm } from 'src/app/models/ExternalFirm';

@Injectable({
  providedIn: 'root'
})
export class ExternalfirmsService {
  URL = environment.BaseURL;
  contentHeaders: HttpHeaders;

  constructor(private http: HttpClient,
    ) {  this.contentHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json');}

    /**
     * wordt new firm toegevoegd aan database.
     * @param externalFirmData object met informatie van de firm die we willen creeren
     */
  addFirm(externalFirmData) {
    const body = {
      externalFirmData
    }
    return this.http.post<ExternalFirm>(this.URL + '/externalFirms', externalFirmData);
  }

  /**
   * het returneert lijst van alle bestaande users
   */
  getAllFirms() {
    return this.http.get<ExternalFirm[]>(this.URL + '/externalFirms');
  }

  /**
   * het verwijdert een firm vanuit database.
   * @param id het id van de firm die we willen verwijderen.
   */
  deleteFirm(id) {
    return this.http.delete<ExternalFirm>(this.URL + '/externalFirms/' + id );
  }



  /**
   * returneet een specifiek firm volgens het id van database
   * @param id id van de gewenst firm die we willen tonen
   */
  getFirmById(id:string)
  {
    return this.http.get<ExternalFirm>(`${this.URL}/externalFirms/${id}`);
  }

  /**
   * wordt een firm geupdate in het databse volgens het id van het firm
   * @param firm het new object van firm die we willen updaten
   * @param firmId het id van de gewenst firm die we willem updaten.
   */
  updateFirm(firm: ExternalFirm, firmId) {

    const body = {
      'email': firm.email,
      'displayName': firm.displayName,
      'telefonNr': firm.telefonNr
    }
    return this.http.put<ExternalFirm>(this.URL + `/externalFirms/${firmId}` ,body)

  }
}
