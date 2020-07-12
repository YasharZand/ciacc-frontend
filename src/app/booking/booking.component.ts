import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../bookings/bookings.service';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements AfterViewInit {
  private subscription: Subscription;

  bookingDatabase: BookingsService | null;
  minDate: Date;
  maxDate: Date;
  selectedDate: Date;
  selectedSlot;
  username: string;
  errorMessage: string = '';
  // data: GithubIssue[] = [];
  slots: Object = [];
  // resultsLength = 0;
  isLoadingResults = false;
  noDateSelected = true;

  @ViewChild(MatButtonToggleGroup) group: MatButtonToggleGroup;
  @ViewChildren(MatButtonToggle) toggles: QueryList<MatButtonToggle>;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  // events: string[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingsService,
    private _httpClient: HttpClient) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 3 * 7);
    // this.onSelect(this.selectedDate);
  }

  ngAfterViewInit(): void {
    this.bookingDatabase = new BookingsService(this._httpClient);
    
    // merge(this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.bookingDatabase!.getBookings('/bookings');
    //       // return this.bookingDatabase!.getRepoIssues(
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

    this.subscription = this.route.queryParams.subscribe(params => {
      this.username = params["username"];
    })
  }


  ngOnDestroy() {
     this.subscription.unsubscribe();
  }

  selectDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(this.bookingDatabase.username);
    this.isLoadingResults = true;
    this.noDateSelected = true;
    this.selectedDate = new Date(event.value);
    let query = (this.selectedDate.getMonth() + 1) + '-' + this.selectedDate.getDate() + '-' + this.selectedDate.getFullYear();
    this.getBookings(query);    
  }

  getBookings = (query) => {
    this.bookingDatabase!.getBookings('/bookings/' + query).subscribe(data => {
      this.isLoadingResults = false;
      this.noDateSelected = false;
      this.slots = data;
      setTimeout(() => {
        this.toggles.forEach(toggle => toggle.buttonToggleGroup = this.group);
      });
      // this.events.push(`${type}: ${this.slots}`);
      console.log(this.slots);
    })
  }

  selectSlot(slot) {
    console.log(slot);
    this.selectedSlot = slot;
  }


  submitSlot() {
    let request = {username:this.username,date: this.selectedSlot.date};
    this.errorMessage = '';
    this.bookingDatabase!.saveBooking('/bookings', request).subscribe(data => {
      this.isLoadingResults = false;
      this.noDateSelected = false;
      if(data.status && data.status == 400)
      {
        this.errorMessage = data.message;
        let query = (this.selectedDate.getMonth() + 1) + '-' + this.selectedDate.getDate() + '-' + this.selectedDate.getFullYear();
        this.getBookings(query);
      }
    })
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


  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  }

}
