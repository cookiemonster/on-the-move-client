import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';

import 'rxjs/add/operator/switchMap';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {isNullOrUndefined} from "util";
import {AbstractControl} from "@angular/forms/src/model";
import {Subscription} from "rxjs/Subscription";
import {LoginPage} from "../login/login.page";
import {RocketchatUserProvider} from "../../providers/rocketchat-user.provider";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.page.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  signUpForm: FormGroup;
  passwordConfirmControl: FormControl;

  private subscription: Subscription;


  constructor(private navCtrl: NavController,
              private rocketchatUserProvider: RocketchatUserProvider,
              private alertCtrl: AlertController,
              formBuilder: FormBuilder) {
    this.signUpForm = formBuilder.group({
      voornaam: ['', Validators.required],
      achternaam: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.passwordConfirmControl = new FormControl('',
      [Validators.required, (control: AbstractControl) => {
        let valid = control.value === this.signUpForm.controls['password'].value;
        return valid ? null : {mismatch: valid};
      }]);

    this.subscription = this.signUpForm.controls['password'].valueChanges
      .subscribe(() => this.passwordConfirmControl.updateValueAndValidity());
  }

  ionViewWillUnload() {
    if (!isNullOrUndefined(this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  doSignup() {
    let username = (this.signUpForm.value.voornaam.toLowerCase() + this.signUpForm.value.achternaam.toLowerCase()).replace(/\s/g, '');
    let account = {
      username: username,
      email: this.signUpForm.value.email,
      name: this.signUpForm.value.voornaam + ' ' + this.signUpForm.value.achternaam,
      pass: this.signUpForm.value.password
    };

    // Attempt to login in through our User service
    this.rocketchatUserProvider.signup(account)
      .subscribe(signup => {
        this.alertCtrl.create({
          title: 'Email bevestigen',
          message: 'Je account is aangemaakt. Voordat je kunt inloggen moet je je e-mailadres verifiëren d.m.v. van de link in de toegestuurde e-mail.',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.navCtrl.push(LoginPage);
              }
            }
          ]
        }).present();
      }, err => {
        this.makeAlert('Aanmelden Rocketchat mislukt', 'Koppeling met Rocketchat is mislukt. Neem contact op met de beheerder.');
      });
  }


  private makeAlert(title: string, message: string) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    }).present();
  }
}
