import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MailTemplate } from 'src/app/models/MailTemplate';

@Injectable({
  providedIn: 'root'
})
export class MailtemplateService {
  URL = environment.BaseURL;
  idToken: string;
  requestOptions;
  headerDict;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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
   * This method is responsible for communicating with the backend to make creation of a new template possible
   * The name of the firm, signature and hyperlink are given default values
   * So when creating a template, only the body of the template is needed
   * @param template this is the template body
   */
  public createTemplate(template) {
    template.firmName =  'Beste firm';
    template.signature = 'Met vriendelijke groeten';
    template.hyperlink = 'Hyperlink: [Hyperlink]';
    return this.http.post<MailTemplate>(this.URL + '/mailtemplate', template, this.requestOptions);
  }

  /**
   * This method fetches all templates from the mailtemplates collection
   */
  getAllTemplates() {
    return this.http.get<MailTemplate[]>(`${this.URL}/mailtemplate`, this.requestOptions);
  }

  /**
   * This method fetches one template from the collection based on the given id
   * @param templateId this is the id of the template to be fetched
   */
  getTemplate(templateId: string) {
    return this.http.get<MailTemplate>(`${this.URL}/mailtemplate/${templateId}`, this.requestOptions);
  }

  /**
   * This method updates an existing mailtemplate
   * @param template this is the new template body to be updated
   */
  updateTemplate(template: MailTemplate) {

    return this.http.put<MailTemplate>(this.URL + `/mailtemplate/${template.id}`, template, this.requestOptions);
  }


}
