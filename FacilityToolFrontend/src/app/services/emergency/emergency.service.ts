import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Emergency } from '../../models/Emergency';

@Injectable({
  providedIn: 'root',
})
export class EmergencyService {
  URL = environment.BaseURL;
  idToken: string;
  requestOptions;
  headerDict;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

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
   * This method is responsible for communicating with the backend to make creation of a contact possible
   * The contact body is sent as a json file to the backend
   * @param contact this is the contact body
   */
  public createContact(contact) {
    const fb = new FormData();
    fb.append('contact', JSON.stringify(contact));
    return this.http.post<Emergency>(
      this.URL + '/contacts',
      fb,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all contacts from the collection
   */
  getAllContacts() {
    return this.http.get<Emergency[]>(
      `${this.URL}/contacts`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch one order from the orders collection
   * depending on the id of the contact
   * @param contactId this is the id of the contact
   */
  getContact(contactId: string) {
    return this.http.get<Emergency>(
      `${this.URL}/contacts/${contactId}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all contacts that belong to a
   * specific department from the emergencycontacts collection
   * @param department this is the department from which the contacts must be fetched
   */
  getContactByDepartment(department) {
    return this.http.get<Emergency>(
      `${this.URL}/contacts/department/${department}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to update an existing contact
   * @param contact this is the contact to be updated
   */
  updateContact(contact: Emergency) {
    return this.http.put<Emergency>(
      this.URL + `/contacts/${contact.id}`,
      contact,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to delete a contact from the collection
   * @param contactId this id the id of the contact to be deleted
   */
  deleteContact(contactId: string) {
    return this.http.delete<Emergency>(
      `${this.URL}/contacts/${contactId}`,
      this.requestOptions
    );
  }
}
