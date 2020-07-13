import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import{ GlobalConstants } from'../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  username : string;
  constructor(private http: HttpClient) { }

  getBookings(route: string, data?: any): Observable<TimeSlot[]> {
    const url = GlobalConstants.apiURL + route;
    let params = new HttpParams();

    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach(key => {
        params = params.set(key, data[key]);
      });
    }
    const result = this.http.get<TimeSlot[]>(url, {
      responseType: 'json',
      params: params
    });
    return result;
    // return new Promise<any>((resolve, reject) => {
    //   result.subscribe(resolve as any, reject as any);
    // });
  }

  saveBooking(route: string, booking: any): Observable<saveResponse> {
    const url = GlobalConstants.apiURL + route;
    const result = this.http.post<saveResponse>(url, booking);
    return result;
  }
  
  setUserName = (username : string) =>
  {
    this.username = username;
  }

}

export interface TimeSlot {
  count: number;
  date: Date;
}

export interface saveResponse {
  username: string;
  date: Date;
  status?: number;
  message?: string;
}
