import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private readonly authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  getUsername = () => {
    return localStorage.getItem('username');
  }

  getToken = () => {
    return localStorage.getItem('token');
  }

}
