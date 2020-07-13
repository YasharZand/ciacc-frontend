import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookingsService } from '../bookings/bookings.service';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  private subscription: Subscription;
  bookings;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingsService,) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.updateDetails(params.username);
    });
    if (GlobalConstants.username == '')
    {
      this.router.navigate(['']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateDetails = (query) => {
    this.bookingService.getBookings('/bookings/user/' + query).subscribe(data => {

      this.bookings = data;
      // this.events.push(`${type}: ${this.slots}`);
      console.log(this.bookings);
    })
  }

}
