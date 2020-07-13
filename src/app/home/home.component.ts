import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BookingsService } from '../bookings/bookings.service'
import { Router } from '@angular/router';
import{ GlobalConstants } from'../common/global-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  username: string;
  isUserSaved: boolean;
  constructor(private router: Router,private bookingService: BookingsService) { }

  ngOnInit(): void {

    this.emailFormControl.valid
  }

  saveUser = () => {
    GlobalConstants.username = this.emailFormControl.value;
    //we can also save it in local storage or backend
    // this.bookingService.setUserName(this.emailFormControl.value);
    this.isUserSaved = true;
  }

  proceedBooking = () => {
    this.router.navigate(['booking']);
    // this.router.navigate(['booking'],{queryParams: {username : this.emailFormControl.value}});
  }

}
