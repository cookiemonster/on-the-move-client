import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {LoginPage} from '../login/login.page';
import {SignupPage} from '../signup/signup.page';
import {MobileAccessibility} from "@ionic-native/mobile-accessibility";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@Component({
  selector: 'page-start',
  templateUrl: 'start.page.html'
})
export class StartPage {

  constructor(private navCtrl: NavController,
              storage: Storage,
              platform: Platform,
              mobileAccessibility: MobileAccessibility) {

    storage.get("email").then((val) => {
      if (val !== null && val.length > 1) {
        this.login()
      }
    });

    // We can only change the font for mobile.
    if (platform.is('cordova')) {
      mobileAccessibility.usePreferredTextZoom(true);
    }
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
