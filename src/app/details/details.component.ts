import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookingsService } from '../bookings/bookings.service';
// import { GlobalConstants } from '../common/global-constants';

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
    // this.subscription = this.route.queryParams.subscribe(params => {
    //   this.updateDetails(params.username);
    // });
    let user = this.bookingService.getUserName();
    if (!user || user == '') {
      this.router.navigate(['']);
    } else {
      this.updateDetails(user);
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  updateDetails = (query) => {
    this.bookingService.getBookings('/bookings/user/' + query).subscribe(data => {
      
      this.bookings = data.map(booking => {
        let ds = new Date(booking.date);
        let de = new Date(ds.valueOf() + (30 * 60 * 1000));
        // console.log(ds.toISOString());
        let st = this.formater(ds);
        let et = this.formater(de);
        booking["calendar"] = "https://calendar.google.com/calendar/r/eventedit?dates="
          + st + "/" + et + "&text=Carsome+Inspection"
          + "&location=No.+28G,+Jalan+Bandar+Tiga,+Pusat+Bandar+Puchong,+47610+Puchong,+Selangor&details=Please+remember+to+bring+your+documents.&ctz=MY&sf=true";
        // console.log(booking["calendar"]);
        return booking;
      });
    })
  }

  formater = (dt : Date) => {

    return dt.toISOString().replace(/-|:|\.\d\d\d/g, "");
    // return dt.toISOString().replace(/-/g,'').replace(/:/g,'').split(".")[0]+"Z";
  }

}
