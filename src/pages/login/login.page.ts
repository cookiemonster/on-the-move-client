import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {MainPage} from '../pages';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CurrentUserService} from "../../providers/current-user.service";
import {RocketchatUserProvider} from "../../providers/rocketchat-user.provider";
import {RocketchatRealtimeProvider} from "../../providers/rocketchat-realtime.provider";
import {ResetPasswordPage} from "../reset-password/reset-password.page";

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  private loginForm: FormGroup;


  constructor(public navCtrl: NavController,
              public rocketchatUserProvider: RocketchatUserProvider,
              private currentUserService: CurrentUserService,
              public alertCtrl: AlertController,
              private storage: Storage,
              formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      rememberLogin: true
    });


    storage.get('email').then((val) => {
      this.loginForm.controls['email'].setValue(val);
    });

    storage.get('password').then((val) => {
      this.loginForm.controls['password'].setValue(val);
    })
  }


  // Attempt to login in through our User service
  doLogin() {
    this.rocketchatUserProvider.login({
      user: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe((resp) => {
      this.currentUserService.$rocketchatUserToken.next(resp.data.authToken);
      this.currentUserService.$rocketchatUserId.next(resp.data.userId);
      if (this.loginForm.value.rememberLogin) {
        this.storage.set('email', this.loginForm.value.email);
        this.storage.set('password', this.loginForm.value.password);
        console.log("Onthoud mij geslaagd!")
      } else {
        this.storage.set('email', "");
        this.storage.set('password', "")
      }
      this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to log in
      let alert = this.alertCtrl.create({
        title: "Inloggen mislukt",
        subTitle: "Controleer a.u.b. uw account informatie en probeer het nogmaals.",
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  resetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }
}
