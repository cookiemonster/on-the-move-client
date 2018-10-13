import {Component} from "@angular/core";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {ChatProvider} from "../../providers/chat.provider";
import {Observable} from "rxjs/Observable";
import {ChatType} from "../chat-detail/chat-detail.page";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Group} from "../../models/group";
import {Channel} from "../../models/channel";

@Component({
  selector: 'page-chat-settings',
  templateUrl: 'chat-settings.page.html'
})
export class ChatSettingsPage {


  chatId: string;
  private chatType: ChatType;

  form: FormGroup;
  private chat: Group | Channel;



  constructor(navParams: NavParams,
              private navController: NavController,
              formBuilder: FormBuilder,
              private chatProvider: ChatProvider,
              private alertController: AlertController) {
    this.chatId = navParams.get('chatId');
    this.chatType = navParams.get('chatType');

    console.log('chatID: ', this.chatId);
    console.log('chatType: ', this.chatType);

    this.form = formBuilder.group({
      name: ['', Validators.required],
      topic: ['']
    });

    let $chat;
    if(this.chatType === ChatType.Group){
      $chat = chatProvider.getGroup(this.chatId);
    }else{
      $chat = chatProvider.getChannel(this.chatId);

    }
    $chat.subscribe(chat => {
      this.chat = chat;
      this.form.controls['name'].setValue(chat.name);
      this.form.controls['topic'].setValue(chat.topic);
    })
  }

  save(){
    let $obs: Observable<any> = Observable.of('empty');
    if(this.chat.name !== this.form.value.name){
      if(this.chatType === ChatType.Group){
        $obs = $obs.switchMap(() => this.chatProvider.renameGroup(this.chatId, this.form.value.name));
      }else{
        $obs = $obs.switchMap(() => this.chatProvider.renameChannel(this.chatId, this.form.value.name));
      }
    }
    if(this.chat.topic !== this.form.value.topic){
      if(this.chatType === ChatType.Group){
        $obs = $obs.switchMap(() => this.chatProvider.setGroupTopic(this.chatId, this.form.value.topic));
      }else{
        $obs = $obs.switchMap(() => this.chatProvider.setChannelTopic(this.chatId, this.form.value.topic));
      }
    }
    $obs.subscribe(() => this.navController.pop(),
      err => {
        this.alertController.create({
          title: 'Error',
          subTitle: 'Er is iets mis gegaan. Mogelijk heb je hiervoor geen rechten.',
          buttons: ['Ok']
        }).present();
      });
  }
}
