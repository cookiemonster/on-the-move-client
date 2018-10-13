import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { ChatProvider } from '../../providers/chat.provider';
import {ChatType, ChatDetailPage} from '../chat-detail/chat-detail.page'
import {CurrentUserService} from "../../providers/current-user.service";
import {Observable} from "rxjs/Observable";
import {Channel} from "../../models/channel";
import "rxjs/add/observable/timer";
import {Group} from "../../models/group";
import {GroupCreatePage} from "../group-create/group-create.page";
import {Subscription} from "rxjs/Subscription";
import {Storage} from "@ionic/storage";
import {isNullOrUndefined} from "util";
import {GroupJoinPage} from "../group-join/group-join.page";


@Component({
  selector: 'page-groups',
  templateUrl: 'groups.page.html'
})
export class GroupsPage {
  private unreadChannelsSubscription: Subscription;
  unreadChannelMessages = [];

  private unreadGroupsSubscription: Subscription;
  unreadGroupMessages = [];

  $publicChannels: Observable<Channel[]>;
  $privateGroups: Observable<Group[]>;

  constructor(private navCtrl: NavController,
              private chatProvider: ChatProvider,
              private currentUserService: CurrentUserService,
              private alertController: AlertController,
              private storage: Storage) {

    this.$publicChannels = currentUserService.$userPublicChannels
      .distinctUntilChanged(null, x => JSON.stringify(x));

    this.$privateGroups = currentUserService.$userPrivateGroups
      .distinctUntilChanged(null, x => JSON.stringify(x));
  }

  ionViewDidEnter() {
    this.chatProvider.getPublicChannels().subscribe(channels => this.currentUserService.$userPublicChannels.next(channels));
    this.chatProvider.getPrivateGroups().subscribe(groups => this.currentUserService.$userPrivateGroups.next(groups));

    if (!isNullOrUndefined(this.unreadChannelsSubscription) && !this.unreadChannelsSubscription.closed) {
      this.unreadChannelsSubscription.unsubscribe();
    }

    this.unreadChannelsSubscription = this.$publicChannels.subscribe(chats => {
      chats.forEach(chat => {
        this.unreadChannelMessages[chat._id] = Observable.timer(0, 60000).timeInterval().switchMap(() => this.storage.get(chat._id)).switchMap(date => this.chatProvider.getUnreadChannelMessages(chat._id, date))
      })
    });

    if (!isNullOrUndefined(this.unreadGroupsSubscription) && !this.unreadGroupsSubscription.closed) {
      this.unreadGroupsSubscription.unsubscribe();
    }

    this.unreadGroupsSubscription = this.$privateGroups.subscribe(chats => {
      chats.forEach(chat => {
        this.unreadGroupMessages[chat._id] = Observable.timer(0, 60000).timeInterval().switchMap(() => this.storage.get(chat._id)).switchMap(date => this.chatProvider.getUnreadGroupMessages(chat._id, date))
      })
    });
  }

  openPublicGroup(channel: Channel){
    this.navCtrl.push(ChatDetailPage, {
      chatId: channel._id,
      name: channel.name,
      chatType: ChatType.Channel
    });
  }



  openPrivateGroup(group: Group){
    this.navCtrl.push(ChatDetailPage, {
      chatId: group._id,
      name: group.name,
      chatType: ChatType.Group
    });
  }

  addGroup(){
    this.alertController.create({
      title: 'Groep toevoegen',
      message: 'Wil je een nieuwe groep maken of lid worden van een groep?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Nieuwe groep',
          handler: () => {
            this.navCtrl.push(GroupCreatePage);
          }
        },
        {
          text: 'Lid worden',
          handler: () => {
            this.navCtrl.push(GroupJoinPage);
          }
        }
      ]
    }).present();
  }
}
