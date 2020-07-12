import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';

const href = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient) { }

  getBookings(route: string, data?: any): Observable<TimeSlot[]> {
    const url = href + route;
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

}

export interface TimeSlot {
  count: number;
  date: Date;
}
