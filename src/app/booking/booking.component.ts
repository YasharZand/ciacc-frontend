import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../bookings/bookings.service';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements AfterViewInit {
  private subscription: Subscription;

  displayedColumns: string[] = ['date', 'name'];
  exampleDatabase: BookingsService | null;
  // data: GithubIssue[] = [];
  slots: Object = [];
  resultsLength = 0;
  isLoadingResults = false;
  noDateSelected = true;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  events: string[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingsService,
    private _httpClient: HttpClient) {
    // this.onSelect(this.selectedDate);
  }

  ngAfterViewInit(): void {
    // this.exampleDatabase = new BookingsService(this._httpClient);
    // merge(this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getBookings('/bookings');
    //       // return this.exampleDatabase!.getRepoIssues(
    //       //   this.sort.active, this.paginator.pageIndex);
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.noDateSelected = false;
    //       this.resultsLength = 10;
    //       return data;
    //       // return data.items;
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       // Catch if the GitHub API has reached its rate limit. Return empty data.
    //       this.noDateSelected = true;
    //       return observableOf([]);
    //     })
    //   ).subscribe(data => this.data = data);
    // this.subscription = this.route.queryParams.subscribe(params => {
    //   this.searchBooks(params['query']);
    // });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.isLoadingResults = true;
    this.noDateSelected = true;
    let g = new Date(event.value);
    let query = g.getDate() + '-' + (g.getMonth() + 1) + '-' + g.getFullYear();
    //console.log(g.getDate()+'-'+(g.getMonth() + 1)+'-'+g.getFullYear());
    //this.events.push(`${type}: ${g.getDate()+'-'+(g.getMonth() + 1)+'-'+g.getFullYear()}`);
    this.bookingService!.getBookings('/bookings/' + query).subscribe(data => {
      this.isLoadingResults = false;
      this.noDateSelected = false;
      this.slots = data;
      // this.events.push(`${type}: ${this.slots}`);
      console.log(this.slots);
    })
  }


  async searchBooks(query: string) {
    // const results = await this.bookingService.searchBooks(query);

    // this.bookings.data = results.docs;
  }

  // viewDetails(book) {
  //   console.log(book);
  //   this.router.navigate(['details'], { queryParams: {
  //     title: book.title,
  //     authors: book.author_name && book.author_name.join(', '),
  //     year: book.first_publish_year,
  //     cover_id: book.cover_edition_key
  //   }});
  // }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

}
