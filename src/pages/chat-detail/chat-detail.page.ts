import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Content} from 'ionic-angular';
import {ChatProvider} from '../../providers/chat.provider';
import {FormControl, Validators} from "@angular/forms";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";
import {Message} from "../../models/message";
import {CurrentUserService} from "../../providers/current-user.service";
import {Storage} from "@ionic/storage";
import {ChatSettingsPage} from "../chat-settings/chat-settings.page";
import {GroupAddUsersPage} from "../group-add-users/group-add-users.page";

/**
 * Generated class for the ChatDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-chat-detail',
  templateUrl: 'chat-detail.page.html',
})
export class ChatDetailPage {
  @ViewChild(Content) content: Content;


  public chatbox: FormControl = new FormControl('', Validators.required);
  public $messages: Observable<Message[]>;
  public chatname: string;

  chatId: string;
  private _$messages: ReplaySubject<Message[]> = new ReplaySubject<Message[]>(1);
  private _$messageProvider: Observable<Message[]>;
  private chatType: ChatType;

  constructor(navParams: NavParams,
              private navCtrl: NavController,
              private chatProvider: ChatProvider,
              public currentUserService: CurrentUserService,
              private storage: Storage) {
    this.chatId = navParams.get('chatId');
    this.chatname = navParams.get('name');
    this.chatType = navParams.get('chatType');


    if (this.chatType === ChatType.Channel) {
      this._$messageProvider = chatProvider.getPublicChannelMessages(this.chatId);
    } else if (this.chatType === ChatType.Group) {
      this._$messageProvider = chatProvider.getPrivateGroupMessages(this.chatId);
    } else {
      this._$messageProvider = chatProvider.getChatMessages(this.chatId);
    }

    this.$messages = this._$messages
      .distinctUntilChanged(null, x => JSON.stringify(x))
      .do(() => setTimeout(() => {
        this.content.scrollToBottom(50).then(() => {
        })
      }));

    this.loadMessages();
  }

  ionViewDidEnter(){
    this.content.scrollToBottom(50).then(() => {
    })
    this.storage.set(this.chatId, new Date());
  }

  ionViewWillDisappear(){
    this.storage.set(this.chatId, new Date());
  }

  loadMessages() {
    this._$messageProvider
      .map(messages => messages.reverse())
      .subscribe(messages => this._$messages.next(messages));
  }


  send() {
    let message = this.chatbox.value;
    this.chatbox.setValue('');

    this.chatProvider.sendChatMessage(this.chatId, message)
      .subscribe(() => this.loadMessages());
  }

  openSettings(){
    this.navCtrl.push(ChatSettingsPage, {
      chatId: this.chatId,
      chatType: this.chatType
    });
  }

  addPerson(){
    this.navCtrl.push(GroupAddUsersPage, {
      chatId: this.chatId,
      chatType: this.chatType
    });
  }

}

export enum ChatType{
  Chat = 0,
  Group = 1,
  Channel = 2
}
