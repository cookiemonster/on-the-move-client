import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {ChatDetailPage, ChatType} from '../chat-detail/chat-detail.page';

import {Observable} from "rxjs/Observable";
import {CurrentUserService} from "../../providers/current-user.service";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/delay";
import {Chat} from "../../models/chat";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/concat";
import "rxjs/add/operator/defaultIfEmpty";
import {RocketChatUser} from "../../models/rocket-chat-user";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/observable/zip";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/timeout";
import "rxjs/add/observable/concat";
import "rxjs/add/operator/mergeAll";
import {Subscription} from "rxjs/Subscription";
import {isNullOrUndefined} from 'util';
import {UserProvider} from "../../providers/user.provider";
import {ChatProvider} from "../../providers/chat.provider";
import "rxjs/add/observable/of";
import {User} from "../../models/user";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/timeInterval";
import {Storage} from "@ionic/storage";


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.page.html'
})
export class ChatPage {
  profileImgBase = UserProvider.profileImgBaseUrlUsername;
  private indexedUsers = [];

  $chats: Observable<Chat[]>;

  unreadMessages = [];
  private subscription: Subscription;
  private unreadSubscription: Subscription;



  constructor(private navCtrl: NavController,
              private currentUserService: CurrentUserService,
              private chatProvider: ChatProvider,
              private storage: Storage) {

    this.$chats = currentUserService.$userChats
      .distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y));


    this.subscription = this.$chats
      .switchMap((chats: Chat[]) => Observable.forkJoin(chats.map(chat => chatProvider.getChatMembers(chat._id))), (chats, users) => [chats, users])
      .combineLatest(this.currentUserService.$userProfile, (a, b) => [a[0], a[1], b])
      .map((chatsAndUsers: any) => {
        const chats: Chat[] = chatsAndUsers[0];
        const chatUsers: Array<RocketChatUser[]> = chatsAndUsers[1];
        const currentUser: User = chatsAndUsers[2];

        let indexedUsers = [];

        for (let i = 0; i < chats.length; i++) {
          indexedUsers[chats[i]._id] = chatUsers[i].find(user => user._id !== currentUser.rcid);
        }

        return indexedUsers;
      })
      .subscribe(res => this.indexedUsers = res)

  }

  ionViewWillEnter() {
    this.chatProvider.getChats().subscribe(chats => this.currentUserService.$userChats.next(chats));

    if (!isNullOrUndefined(this.unreadSubscription) && !this.unreadSubscription.closed) {
      this.unreadSubscription.unsubscribe();
    }

    this.unreadSubscription = this.$chats.subscribe(chats => {
      chats.forEach(chat => {
        this.unreadMessages[chat._id] = Observable.timer(0, 60000).timeInterval().switchMap(() => this.storage.get(chat._id)).switchMap(date => this.chatProvider.getUnreadChatMessages(chat._id, date))
      })
    });
  }

  ionViewWillUnload() {
    if (!isNullOrUndefined(this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  openChat(chat: Chat) {
    let chatname = this.indexedUsers[chat._id].name;

    this.navCtrl.push(ChatDetailPage, {
      chatId: chat._id,
      name: chatname,
      chatType: ChatType.Chat
    });
  }

}
