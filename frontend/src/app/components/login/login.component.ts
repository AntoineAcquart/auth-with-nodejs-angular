import { Component, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RegisterDialogComponent } from './dialog/register.dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  loginFormError: string;
  loginForm = false;
  registerForm = false;

  constructor(private readonly authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.dialog = dialog;
  }

  ngOnInit() {
  }

  toggleRegister() {
    this.registerForm = !this.registerForm;
    this.openDialog();
  }

  toggleLogin() {
    this.registerForm = !this.registerForm;
    this.loginForm = !this.loginForm;
  }

  login() {
    delete this.loginFormError;
    if (this.loginGroup.invalid) {
      this.loginFormError = 'tous les champs ne sont pas valides.';
      return;
    }

    let username: string = this.loginGroup.get("username").value;
    let password: string = this.loginGroup.get("password").value;

    this.authenticationService.login(username, password).subscribe({
      next: response => {
        localStorage.setItem('username', response.username);
        localStorage.setItem('token', response.token);
      },
      error: err => {
        console.log(err);
        this.loginFormError = err.statusText;
      }
    });
  }

  /**
   * Open the dialog modal and return created slides after close
   */
  public openDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '360px',
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.registerForm = false;
    });
  }

}
