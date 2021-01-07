import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order, Status, Category } from '../../models/Order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  URL = environment.BaseURL;
  userid = localStorage.getItem('UserID');
  userName = localStorage.getItem('UserName');
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
   * This method is responsible for communicating with the backend to make creation of an order possible
   * This method needs three parameters to be able to carry out its function
   * The order body is sent as a json file to the backend
   * @param order this is the order body
   * @param userName this is the name of the requester(the person making the order)
   * @param userId this is the id of the requester
   */
  public createOrder(order, userName, userId) {
    order.requesterId = userId;
    order.requesterName = userName;
    order.Status = Status.OPEN;

    const fb = new FormData();
    fb.append('order', JSON.stringify(order));
    return this.http.post<Order>(this.URL + '/order', fb, this.requestOptions);
  }

  /**
   * This method communicates directly with the backend to fetch all orders from the orders collection
   */
  getOrders() {
    return this.http.get<Order[]>(`${this.URL}/orders`, this.requestOptions);
  }

  /**
   * This method communicates directly with the backend to fetch one order
   * from the orders collection based on the given id
   * @param orderId this is the id of the order to be fetched
   */
  getOrder(orderId: string) {
    return this.http.get<Order>(
      `${this.URL}/order/${orderId}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to assign an order to an employee
   * The request body comprises of the user to be assigned, the id of the requester and the id of the order
   * @param assignedUser this is the user to be assigned to the order
   * @param requesterId this is the id of the person who placed the order
   * @param orderId this is the id of the order
   */
  assignOrderToEmployee(assignedUser, requesterId, orderId) {
    const body = {
      assignTo: assignedUser,
      requesterId,
      orderId,
    };
    return this.http.post(
      this.URL + '/order/assignEmployee',
      body,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to assign an order to an external firm
   * The reequest body comprises of the firm to be assigned, the id of the requester and the id of the order
   * @param assignedFirm this is the firm to be assigned to the order
   * @param requesterId this is the id of the person who placed the order
   * @param orderId this is the id of the order
   */
  assignOrderToFirm(assignedFirm, requesterId, orderId) {
    const body = {
      assignToFirm: assignedFirm,
      requesterId,
      orderId
    };
    return this.http.post(this.URL + '/order/assignFirm', body, this.requestOptions);
  }



  /**
   * This method communicates directly with the backend to update an existing order
   * The request body is sent as json object and only one parameter is needed
   * @param order this is the order to be updated
   */
  updateOrder(order: Order) {
    const fb = new FormData();
    fb.append('order', JSON.stringify(order));
    return this.http.put<Order>(
      this.URL + `/order/${order.id}`,
      fb,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all categories from the categories collection
   */
  getAllCategorie() {
    return this.http.get<Category[]>(
      this.URL + '/getAllCategory',
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all orders made by the logged in user
   * @param userId this is the id of the currently logged in user
   */
  getMyOrders(userId: string) {
    return this.http.get<Order[]>(
      this.URL + `/byRequesterId/${userId}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch all orders that have been assigned to
   * the currently logged in user
   */
  getOrdersAssignToMe() {
    return this.http.get<Order[]>(
      this.URL + `/orders/assignToId/${this.userid}`,
      this.requestOptions
    );
  }

  /**
   * This method communicates directly with the backend to fetch delete an order from the collection
   * @param id the id of the order to be deleted
   */
  deleteOrder(id) {
    return this.http.delete<Order>(
      this.URL + '/order/delete/' + id,
      this.requestOptions
    );
  }
}
