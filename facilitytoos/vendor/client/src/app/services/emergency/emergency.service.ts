import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Emergency } from '../../models/emergency';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  URL = environment.BaseURL;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /**
   *
   * @param contact
   */
  public createContact(contact) {
    const fb = new FormData();
    fb.append('contact', JSON.stringify(contact));
    return this.http.post<Emergency>(this.URL + '/contacts', fb);
  }


  getAllContacts(): Observable<Emergency[]> {
    return this.http.get<Emergency[]>(`${this.URL}/contacts`);
  }

  getContact(contactId: string): Observable<Emergency> {
    return this.http.get<Emergency>(`${this.URL}/contacts/${contactId}`);
  }

  getContactByDepartment(department) {
    return this.http.get<Emergency>(`${this.URL}/contacts/department/${department}`);
  }


  updateContact(contact: Emergency) {

    return this.http.put<Emergency>(this.URL + `/contacts/${contact.id}`, contact);
  }

  deleteContact(contactId: string){
    return this.http.delete<Emergency>(`${this.URL}/contacts/${contactId}`);
  }
}
