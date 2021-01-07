import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExternalFirm } from 'src/app/models/ExternalFirm';

@Injectable({
  providedIn: 'root',
})
export class ExternalfirmsService {
  URL = environment.BaseURL;
  contentHeaders: HttpHeaders;
  idToken: string;
  requestOptions;
  header;
  requestOption;
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
   * This method is responsible for communicating with the backend to make creation of a new firm possible
   * @param externalFirmData this is the object body of the firm to be created
   */
  addFirm(externalFirmData) {
    return this.http.post<ExternalFirm>(
      this.URL + '/externalFirms',
      externalFirmData,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating directly with the backend to fetch all saved firms
   * from the collection
   */
  getAllFirms() {
    return this.http.get<ExternalFirm[]>(
      this.URL + '/externalFirms',
      this.requestOptions
    );
  }

  /**
   * This method gets an id token for a firm to have access to a page without logging in
   * @param id this is the id token
   */
  getFirmIdToken(id) {
    this.header = {
      Authorization: 'Bearer ' + this.idToken,
    };
    this.requestOption = {
      headers: new HttpHeaders(this.headerDict),
      responseType: 'text'
    };
    return this.http.get(
      this.URL + '/externalFirmToken/' + id,
      this.requestOption
    );
  }

  /**
   * This method is responsible for communicating directly with the backend to delete a firm from the collection
   * @param id this is the id of the firm to be deleted
   */
  deleteFirm(id) {
    return this.http.delete<ExternalFirm>(
      this.URL + '/externalFirms/' + id,
      this.requestOptions
    );
  }

  /**
   * This method fetches one firm from the database depending on the given id
   * @param id this is the id of the firm fetched
   */
  getFirmById(id: string) {
    return this.http.get<ExternalFirm>(
      this.URL + '/externalFirms/' + id,
      this.requestOptions
    );
  }

  /**
   * This method updates an existing firm in the collection
   * @param firm the updated firm data to be sent to the database
   * @param firmId this is the id of the firm to be updated
   */
  updateFirm(firm: ExternalFirm, firmId) {
    const body = {
      email: firm.email,
      displayName: firm.displayName,
      telefonNr: firm.telefonNr,
    };
    return this.http.put<ExternalFirm>(
      this.URL + '/externalFirms/' + firmId,
      body,
      this.requestOptions
    );
  }
}
