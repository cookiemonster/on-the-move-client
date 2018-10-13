import {Component} from "@angular/core";
import {RocketchatUserProvider} from "../../providers/rocketchat-user.provider";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AbstractControl} from "@angular/forms/src/model";
import {Subscription} from "rxjs/Subscription";
import {isNullOrUndefined} from "util";
import {AlertController, NavController} from "ionic-angular";


@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.page.html'
})

export class ChangePasswordPage{
  form: FormGroup;
  passwordConfirmControl: FormControl;

  private subscription: Subscription;


  constructor(formBuilder: FormBuilder,
              private rocketchatUserProvider: RocketchatUserProvider,
              private navController: NavController,
              private alertController: AlertController){
    this.form = formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });

    this.passwordConfirmControl = new FormControl('',
      [Validators.required, (control: AbstractControl) => {
        let valid = control.value === this.form.controls['newPassword'].value;
        return valid ? null : {mismatch: valid};
      }]);

    this.subscription = this.form.controls['newPassword'].valueChanges
      .subscribe(() => this.passwordConfirmControl.updateValueAndValidity());

  }

  ionViewWillUnload() {
    if (!isNullOrUndefined(this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  changePassword(){
    this.rocketchatUserProvider.changePassword(this.form.value.oldPassword, this.form.value.newPassword)
      .subscribe(res => {
        this.navController.pop();
      }, err => {
        this.alertController.create({
          title: 'Onjuist wachtwoord',
          message: 'Het huidige wachtwoord is niet juist.',
          buttons: ['Dismiss']
        }).present();
      })
  }
}
