import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { GlobalConstants } from './common/global-constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchForm: FormGroup;
  isRegistered: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router) {
      if (GlobalConstants.username != '')
      {
        this.isRegistered = true;
      }
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
  }

  // onSearch() {
  //   if (!this.searchForm.valid) return;
  //   this.router.navigate(['search'], { queryParams: {query: this.searchForm.get('search').value}});
  // }
}
