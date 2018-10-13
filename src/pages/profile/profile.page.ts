import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';

import {UserProvider} from '../../providers/user.provider';

import {ProfileUpdatePage} from '../profile-update/profile-update.page';
import {CurrentUserService} from "../../providers/current-user.service";
import {ExpertiseProvider} from "../../providers/expertise.provider";
import {Expertise} from "../../models/expertise";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.page.html'
})
export class ProfilePage {

  profileImgBase = UserProvider.profileImgBaseUrlUsername;

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private expertiseProvider: ExpertiseProvider,
              public currentUserService: CurrentUserService) {

  }

  logOut() {
    this.alertCtrl.create({
      title: 'Uitloggen bevestigen',
      message: 'Weet je zeker dat je wilt uitloggen?',
      buttons: [
        {
          text: 'Nee',
          role: 'cancel'
        },
        {
          text: 'Ja',
          handler: () => {
            this.currentUserService.$rocketchatUserId.next(undefined);
            this.currentUserService.$rocketchatUserToken.next(undefined);
            window.location.reload();
          }
        }
      ]
    }).present();
  }

  addExpertise() {
    this.alertCtrl.create({
      title: 'Expertise toevoegen',
      message: 'Geef je naam van je expertise op.',
      inputs: [
        {
          name: 'expertise',
          placeholder: 'Expertise'
        },
      ],
      buttons: [
        {
          text: 'Annuleer',
          role: 'cancel',
        },
        {
          text: 'Voeg toe',
          handler: data => {
            if (data.expertise.length > 0) {
              this.expertiseProvider.addExpertise(data)
                .switchMap(() => this.expertiseProvider.getUserExpertises())
                .subscribe(reloadedExpertises => this.currentUserService.$userExpertises.next(reloadedExpertises));
            } else {
              console.log("Geen expertise ingevuld.");
            }
          }
        }
      ]
    }).present();
  }

  editProfile() {
    this.navCtrl.push(ProfileUpdatePage);
  }

  removeExpertise(expertise: Expertise) {
    this.alertCtrl.create({
      title: ('Verwijder expertise'),
      message: `Weet je zeker dat je dat expertise \"${expertise.expertise}\" wilt verwijdren?`,
      buttons: [
        {
          text: 'Annuleer',
          role: 'cancel',
          handler: () => {
            console.log('Annuleer clicked');
          }
        },
        {
          text: 'Verwijder',
          handler: () => {
            this.expertiseProvider.removeExpertise(expertise)
              .switchMap(() => this.expertiseProvider.getUserExpertises())
              .subscribe(reloadedExpertises => this.currentUserService.$userExpertises.next(reloadedExpertises));
          }
        }
      ]
    }).present();
  }
}
