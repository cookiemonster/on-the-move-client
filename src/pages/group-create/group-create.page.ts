import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {ChatProvider} from "../../providers/chat.provider";
import {AlertController, NavController} from "ionic-angular";
import {RocketChatUser} from "../../models/rocket-chat-user";


@Component({
  selector: 'page-group-create',
  templateUrl: 'group-create.page.html'
})
export class GroupCreatePage {
  form: FormGroup;

  constructor(formBuilder: FormBuilder,
              private chatProvider: ChatProvider,
              private navController: NavController,
              private alertController: AlertController){
    this.form = formBuilder.group({
      'private': true,
      'name': ['', Validators.required],
      'users': [[]]
    });
  }

  save() {
    let payload = {name: this.form.value.name, members: this.form.value.users.map((user: RocketChatUser) => user.username)};
    let request: Observable<any>;

    if(this.form.value.private){
      request = this.chatProvider.createPrivateGroup(payload);
    }else{
      request = this.chatProvider.createPublicChannel(payload);
    }

    request.subscribe(() => {
      this.navController.pop();
    }, () => {
      this.alertController.create({
        title: "Aanmaken mislukt",
        subTitle: "Het aanmaken van de groep is mislukt. Mogelijk bestaat er al een groep met deze naam.",
        buttons: ['Ok']
      }).present();
    })

  }


}
