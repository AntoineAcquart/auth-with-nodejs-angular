import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';

/**
 * This component is a modal that display a creation slide form with file upload
 */
@Component({
  selector: 'app-register-dialog',
  templateUrl: './register.dialog.component.html',
  styleUrls: ['./register.dialog.component.sass']
})
export class RegisterDialogComponent {

  registerGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required])
  });

  registerFormError: string;

  constructor(
    private readonly authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<RegisterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  register() {
    delete this.registerFormError;
    if (this.registerGroup.invalid) {
      this.registerFormError = 'Tous les champs ne sont pas valides.';
      return;
    }

    let username: string = this.registerGroup.get("username").value;
    let password: string = this.registerGroup.get("password").value;
    let confirmPassword: string = this.registerGroup.get("confirmPassword").value;

    if (password != confirmPassword) {
      this.registerFormError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authenticationService.register(username, password).subscribe({
      next: response => {
        localStorage.setItem('username', response.username);
        localStorage.setItem('token', response.token);
        this.onNoClick();
      },
      error: err => {
        console.log(err);
        this.registerFormError = "Ce nom d'utilisateur n'est pas disponible.";
      }
    });
  }

}
