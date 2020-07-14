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
        let ds = new Date(booking.date)
        let de = new Date(ds.valueOf() + (30 * 60 * 1000))
        let st = this.formater(ds);
        let et = this.formater(de);
        booking["calendar"] = "https://calendar.google.com/calendar/r/eventedit?dates="
          + st + "/" + et + "&text=Carsome+Inspection"
          + "&location=No.+28G,+Jalan+Bandar+Tiga,+Pusat+Bandar+Puchong,+47610+Puchong,+Selangor&details=Please+remember+to+bring+your+documents.&sf=true";
        // console.log(booking["calendar"]);
        return booking;
      });
    })
  }

  formater = (dt : Date) => {
    const formatter = new Intl.DateTimeFormat('my',{
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var parts = formatter.formatToParts(dt);
    return parts[4].value+parts[0].value+parts[2].value+"T"+parts[6].value+parts[8].value+parts[10].value+"Z";
  }

}
