import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {StartPage} from '../start/start.page';


export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.page.html'
})
export class TutorialPage {
  @ViewChild(Slides) slides: Slides;
  slides_content: Slide[];
  showSkip = true;

  constructor(private navCtrl: NavController,
              private menu: MenuController,
              private storage: Storage) {
    this.slides_content = [
      {
        title: "Ook moeite met het vinden van collega's?",
        description: "",
        image: "assets/img/1047-verveling-wit.png",
      },
      {
        title: "Welkom bij OnTheMove",
        description: "Met de <strong>OnTheMove</strong> app kun je snel " +
        "collega's vinden op naam, functie en expertise...",
        image: 'assets/img/1026-start-wit.png',
      },
      {
        title: "",
        description: "... en kun je met hen " +
        "chatten, zowel via een mobiel device als een desktop device.",
        image: 'assets/img/0002-man-lopend-wit.png',
      }
    ];
  }

  startApp() {
    this.storage.set("showTutorial", "false");
    this.navCtrl.setRoot(StartPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  nextSlide() {
    let active = this.slides.getActiveIndex();
    this.slides.slideTo(active + 1, 500);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
