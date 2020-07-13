import { Component, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../bookings/bookings.service';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { GlobalConstants } from '../common/global-constants';

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
  slots: Object = [];
  isLoadingResults = false;
  noDateSelected = true;

  @ViewChild(MatButtonToggleGroup) group: MatButtonToggleGroup;
  @ViewChildren(MatButtonToggle) toggles: QueryList<MatButtonToggle>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _httpClient: HttpClient) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 3 * 7);
    // this.onSelect(this.selectedDate);
  }

  ngAfterViewInit(): void {
    this.bookingDatabase = new BookingsService(this._httpClient);
    this.username = GlobalConstants.username;
    //We can also recieve from parameters
    // this.subscription = this.route.queryParams.subscribe(params => {
    //   this.username = params["username"];
    // })
    if (this.username == '') {
      this.router.navigate(['']);
    }
  }


  ngOnDestroy() {
    //  this.subscription.unsubscribe();
  }

  selectDate(type: string, event: MatDatepickerInputEvent<Date>) {

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
    if (slot.count) {
      this.selectedSlot = slot;
    }
  }


  submitSlot() {
    // var d = new Date(this.selectedSlot.date);
    let request = { username: this.username, date: this.selectedSlot.date };
    this.errorMessage = '';
    this.bookingDatabase!.saveBooking('/bookings', request).subscribe(data => {
      this.isLoadingResults = false;
      this.noDateSelected = false;
      if (data.status && data.status == 400) {
        this.errorMessage = data.message;
        let query = (this.selectedDate.getMonth() + 1) + '-' + this.selectedDate.getDate() + '-' + this.selectedDate.getFullYear();
        this.getBookings(query);
      } else {
        this.router.navigate(['details'], { queryParams: { username: this.username } });
      }
    })
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  }

}
