import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirstRunPage } from '../pages/pages';
import { LoadPage } from '../pages/pages';


@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})

export class MyApp {
  rootPage: any = "";

  @ViewChild(Nav) nav: Nav;

  constructor(
              private platform: Platform,
              private config: Config,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private storage: Storage) {
    this.storage.get("showTutorial").then((val) => {
      if(val == "false"){
        this.rootPage = LoadPage;
      } else {
        this.rootPage = FirstRunPage;
      }
    })
    this.initTranslate();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    // this.translate.setDefaultLang('nl');
    //
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
    //   this.translate.use('nl'); // Set your language here
    // }

    this.config.set('ios', 'backButtonText', 'Terug');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
