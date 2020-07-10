import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../bookings/bookings.service';
import { MatFormField } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  private subscription: Subscription;

  bookings;// = new MatTableDataSource<any>();
  title = 'ng-calendar-demo';
  selectedDate = new Date('2019/09/26');
  startAt = new Date('2019/09/11');
  minDate = new Date('2019/09/14');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  year: any;
  DayAndDate: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private bookingService: BookingsService) { 
                this.onSelect(this.selectedDate);
              }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.searchBooks(params['query']);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async searchBooks(query: string) {
    const results = await this.bookingService.searchBooks(query);

    this.bookings.data = results.docs;
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

  onSelect(event) {
    console.log(event);
    this.selectedDate = event;
    const dateString = event.toDateString();
    const dateValue = dateString.split(' ');
    this.year = dateValue[3];
    this.DayAndDate = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
  }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6 ;
  }

}
