import {Component} from "@angular/core";
import {RocketchatRealtimeProvider} from "../../providers/rocketchat-realtime.provider";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertController, NavController} from "ionic-angular";
import {LoginPage} from "../login/login.page";

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.page.html'
})
export class ResetPasswordPage {

  form: FormGroup;

  constructor(private rocketchatRealtimeProvider: RocketchatRealtimeProvider,
              private alertController: AlertController,
              private navController: NavController,
              formBuilder: FormBuilder){
    this.form = formBuilder.group({
      email: ['', Validators.email]
    });

  }


  resetPassword(){
    this.rocketchatRealtimeProvider.sendForgotPasswordEmail(this.form.value.email).subscribe(res => {
      this.alertController.create({
        title: 'Wachtwoord resetten',
        message: 'Er is een e-mail gestuurd met instructies om het wachtwoord te resetten.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navController.pop();
            }
          }
        ]
      }).present();
    })
  }

}
