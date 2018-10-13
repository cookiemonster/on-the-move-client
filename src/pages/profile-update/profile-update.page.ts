import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';

import {UserProvider} from '../../providers/user.provider';
import {User} from "../../models/user";
import {CurrentUserService} from "../../providers/current-user.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'page-profile-update',
  templateUrl: 'profile-update.page.html'
})
export class ProfileUpdatePage {

  private user: User;
  form: FormGroup;

  constructor(private navCtrl: NavController,
              private userProvider: UserProvider,
              private currentUserService: CurrentUserService,
              private alertController: AlertController,
              formBuilder: FormBuilder) {

    this.form = formBuilder.group({
      voornaam: '',
      achternaam: '',
      organisatieonderdeel: '',
      telefoonnummermobiel: '',
      telefoonnummervast: '',
      achtervang: '',
      werktijden: '',
      kamer: '',
      overmij: '',
      taken: '',
      functie: ''
    });

    currentUserService.$userProfile.take(1).subscribe(user => {
      this.user = user;

      this.form.controls['voornaam'].setValue(user.voornaam);
      this.form.controls['achternaam'].setValue(user.achternaam);
      this.form.controls['organisatieonderdeel'].setValue(user.organisatieonderdeel);
      this.form.controls['functie'].setValue(user.functie);
      this.form.controls['telefoonnummermobiel'].setValue(user.telefoonnummermobiel);
      this.form.controls['telefoonnummervast'].setValue(user.telefoonnummervast);
      this.form.controls['achtervang'].setValue(user.achtervang);
      this.form.controls['werktijden'].setValue(user.werktijden);
      this.form.controls['kamer'].setValue(user.kamer);
      this.form.controls['overmij'].setValue(user.overmij);
      this.form.controls['taken'].setValue(user.taken);
    })
  }
  updateProfile() {
    Object.assign(this.user, this.form.value);
    this.userProvider.update(this.user)
      .switchMap(() => this.userProvider.getCurrentUserProfiel())
      .subscribe(user => {
        this.currentUserService.$userProfile.next(user);
        this.navCtrl.pop();
      }, err => {
        this.alertController.create({
          title: 'Error',
          subTitle: 'Fout bij het updaten van het profiel.',
          buttons: ['Ok']
        }).present();
      });
  }

}
