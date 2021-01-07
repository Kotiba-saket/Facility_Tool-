import { Category } from './../models/Report';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  URL = environment.BaseURL;
  contentHeaders: HttpHeaders;
  constructor(private http: HttpClient ){
    this.contentHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json');
  }

  /**
   * get lijst van categories volgens de geselecteerde afdeling
   * @param department depatment naam
   */
  getCategoriesBydepartment(department):Observable<Category> {
      return this.http.get<Category>(this.URL + '/getAllCategoryBydepartment/' + department );
  }

  /**
   *  Returneert alle departementen met hun categorieën
   */
  getAllCategories():Observable<Category[]>
  {
    return this.http.get<Category[]>(`${this.URL}/getAllCategory`);
  }

  addCategory(departmentId:String, category:String)
  {
    return this.http.post(`${this.URL}/category/${departmentId}`, {category});
  }

  deleteCategory(departmentId:String, category:String)
  {
    return this.http.request('delete', `${this.URL}/category/${departmentId}`, {body: {category}});
  }

  newDepartment(department:String)
  {
    return this.http.request('post', `${this.URL}/department/${department}`);
  }

  deleteDepartment(departmentId:String)
  {
    return this.http.delete(`${this.URL}/department/${departmentId}`);
  }
}
