import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order, Status, Category } from '../../models/Order';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  URL = environment.BaseURL;
   userid = localStorage.getItem('UserID');
  userName = localStorage.getItem('UserName');

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) {}

  public createOrder(order,userName,userId) {
    order.requesterId = userId;
    order.requesterName = userName;
    order.Status = Status.OPEN;

    const fb = new FormData();
    fb.append('order', JSON.stringify(order));
    return this.http.post<Order>(this.URL + '/order', fb);
  }

  getOrders(): Observable<Order[]>
  {
    return this.http.get<Order[]>(`${this.URL}/orders`);
  }


  /**
   * Ontvang een report op basis van id
   * @param orderId
   */
  getOrder(orderId: string): Observable<Order>
  {
    return this.http.get<Order>(`${this.URL}/order/${orderId}`);
  }

  assignOrderToEmployee(assignedUser, requesterId, orderId) {
    const body = {
      assignTo: assignedUser,
      requesterId: requesterId,
      orderId: orderId
    }
    return this.http.post(this.URL + '/order/assignEmployee', body);
  }


   /**
   * Update een report op basis van id
   * @param order
   */
  updateOrder(order: Order)
  {
    const fb = new FormData();
    fb.append('order', JSON.stringify(order));
    return this.http.put<Order>(this.URL + `/order/${order.id}`, fb)
  }


  getAllCategorie(){
    return this.http.get<Category[]>(this.URL + '/getAllCategory');
  }


  getMyOrders(userId: string) {
    return this.http.get<Order[]>(this.URL + `/byRequesterId/${userId}`);
   }

   getOrdersAssignToMe() {
     return this.http.get<Order[]>(this.URL + `/orders/assignToId/${this.userid}`);
   }

  /**
   * Delete order from Orders Collections in de database
   * @param id order id
   */
  deleteOrder(id) {
    return this.http.delete<Order>(this.URL + '/order/' + id );
  }
}
