import { OrderCommentData } from './../models/Order';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { OderComment } from '../models/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderCommentService {
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
   * This method is responsible for communicating with the backend to add a new comment to a order
   * @param comment this is the comment to be added
   * @param orderId this is the id of the logged in user adding the comment
   * @param orderCommentData this is the comment body saved to the collection
   */
  addComment(
    comment: OderComment,
    orderId,
    orderCommentData: OrderCommentData
  ) {
    comment.orderId = orderId;
    comment.orderCommentData.push(orderCommentData);

    return this.http.post(
      this.URL + '/orderComment/' + orderId,
      comment,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to fetch all comments on an order from the collection
   * It fetches all comments along with the people who made them
   * @param orderId this is the id of the order to be fetched
   */
  getComment(orderId) {
    return this.http.get<OderComment>(
      this.URL + '/orderComment/' + orderId,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to update an existing comment
   * @param orderId this is the id of the order which is getting its comment updated
   * @param index this is the position of the comment in the comment array
   * @param text this is the comment body
   */
  updateComment(orderId, index, text) {
    return this.http.patch(
      this.URL + '/orderComment/' + orderId + '/' + index + '?text=' + text,
      null,
      this.requestOptions
    );
  }

  /**
   * This method is responsible for communicating with the backend to delete an existing comment
   * @param orderId this is the id of the order which is getting its comment deleted
   * @param index this is the position of the comment in the comment array
   */
  deleteComment(orderId, index) {
    return this.http.delete(
      this.URL + '/orderComment/' + orderId + '/' + index,
      this.requestOptions
    );
  }
}
