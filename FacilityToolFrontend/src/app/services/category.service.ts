import { Category } from './../models/Report';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  URL = environment.BaseURL;
  contentHeaders: HttpHeaders;
  idToken: string;
  requestOptions;
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
   * This method is responsible for communicating with the backend to fetch all categories depending of the department
   * @param department this is the department from which catgories are to be fetched
   */
  getCategoriesBydepartment(department) {
    return this.http.get<Category>(
      this.URL + '/category/' + department,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all categories, irrespective of the
   * department, from the collection
   */
  getAllCategories() {
    return this.http.get<Category[]>(
      `${this.URL}/category`,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to add a new category to an existing department
   * @param departmentId this is the id of the department to receive the new category
   * @param category this is the category to be added
   */
  addCategory(departmentId: string, category: string) {
    return this.http.post(
      `${this.URL}/category/${departmentId}`,
      { category },
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to delete an existing category from a department
   * @param departmentId this is the id of the department of the category to be deleted
   * @param category this is the category to be deleted
   */
  deleteCategory(departmentId: string, category: string) {
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
      body: { category },
    };

    return this.http.delete(
      `${this.URL}/category/${departmentId}`,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to add a new department
   * @param department this is the department to be created
   */
  newDepartment(department: string) {
    return this.http.request(
      'post',
      `${this.URL}/department/${department}`,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to delete an existing department
   * @param departmentId this is the id of the department to be deleted
   */
  deleteDepartment(departmentId: string) {
    return this.http.delete(
      `${this.URL}/department/${departmentId}`,
      this.requestOptions
    );
  }
}
