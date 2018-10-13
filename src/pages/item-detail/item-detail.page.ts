import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ChatDetailPage, ChatType} from '../chat-detail/chat-detail.page';
import {UserProvider} from '../../providers/user.provider'
import {User} from "../../models/user";
import {Expertise} from "../../models/expertise";
import {Chat} from "../../models/chat";
import {RocketchatUserProvider} from "../../providers/rocketchat-user.provider";
import {Observable} from "rxjs/Observable";
import {RocketChatUser} from "../../models/rocket-chat-user";

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.page.html',
})
export class ItemDetailPage {
  user: User;
  expertises: Expertise[] = [];
  profileImgBase = UserProvider.profileImgBaseUrlUserId;

  $rocketchatUser: Observable<RocketChatUser>


  constructor(private navCtrl: NavController,
              navParams: NavParams,
              rocketchatUserProvider: RocketchatUserProvider
              ) {
    this.user = navParams.get('user');
    this.expertises = navParams.get('expertises');
    this.$rocketchatUser = rocketchatUserProvider.getRocketchatUser(this.user.rcid);


  }

  openChat() {
    let chat: Chat = new Chat();
    chat._id = '@' + this.user.rcid;

    let name = this.user.voornaam + this.user.achternaam;

    this.navCtrl.push(ChatDetailPage, {
      chatId: chat._id,
      name: name,
      chatType: ChatType.Chat
    });
  }

}
