import {Component} from '@angular/core';
import {GroupsPage} from '../groups/groups.page';
import {SearchPage} from '../search/search.page';
import {ChatPage} from '../chat/chat.page';
import {ProfilePage} from '../profile/profile.page';
import {UserProvider} from "../../providers/user.provider";
import {CurrentUserService} from "../../providers/current-user.service";
import {ExpertiseProvider} from "../../providers/expertise.provider";
import {ChatProvider} from "../../providers/chat.provider";
import {NotificationEventResponse, Push, PushObject, PushOptions} from "@ionic-native/push";
import {NavController, Platform} from "ionic-angular";
import "rxjs/add/observable/dom/webSocket";
import "rxjs/add/operator/retry";
import {RocketchatUserProvider} from "../../providers/rocketchat-user.provider";
import "rxjs/add/operator/publish";
import {Subscription} from "rxjs/Subscription";
import {isNullOrUndefined} from "util";
import {ChatDetailPage, ChatType} from "../chat-detail/chat-detail.page";
import {CONFIG} from "../../../app-config";
import {ChangePasswordPage} from "../change-password/change-password.page";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.page.html'
})
export class TabsPage {
  tab1Root: any = SearchPage;
  tab2Root: any = ChatPage;
  tab3Root: any = GroupsPage;
  tab5Root: any = ProfilePage;

  private subscriptions: Subscription[] = [];

  constructor(
    userProvider: UserProvider,
    currentUserService: CurrentUserService,
    expertiseProvider: ExpertiseProvider,
    chatProvider: ChatProvider,
    private push: Push,
    private navController: NavController,
    platform: Platform,
    private rocketchatUserProvider: RocketchatUserProvider,
  ) {
    userProvider.getCurrentUserProfiel().subscribe(user => currentUserService.$userProfile.next(user));
    rocketchatUserProvider.getCurrentRocketchatUser().subscribe(user => currentUserService.$rocketchatUserProfile.next(user));
    expertiseProvider.getUserExpertises().subscribe(expertises => currentUserService.$userExpertises.next(expertises));
    chatProvider.getChats().subscribe(chats => currentUserService.$userChats.next(chats));
    chatProvider.getPublicChannels().subscribe(channels => currentUserService.$userPublicChannels.next(channels));
    chatProvider.getPrivateGroups().subscribe(groups => currentUserService.$userPrivateGroups.next(groups));

    rocketchatUserProvider.getPermissions().subscribe(console.log);


    // We can only receive notifications for mobile.
    if(platform.is('cordova')){
      push.hasPermission()
        .then((res: any) => {
          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
            this.initPush();
          } else {
            console.log('We do not have permission to send push notifications');
          }
        });
    }

  }

  initPush(){
    // Needed for Android O, not sure how to connect this to the notification.
    this.push.createChannel({
      id: "otm-message-channel",
      description: "OTM berichten",
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 4
    }).then(() => console.log('Channel created'));


    const options: PushOptions = {
      android: {
        senderID: CONFIG.senderId,
        sound: true,
        vibrate: true,
        icon: 'ic_directions_run_white_24dp',
        iconColor: "#343434"
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    this.subscriptions.push(pushObject.on('notification').subscribe((notification: NotificationEventResponse) => {
      console.log('Received a notification' + JSON.stringify(notification));
      if(!notification.additionalData.foreground){ // Only open the chat page when the app is/was in the packground
        this.navController.push(ChatDetailPage, {
          chatId:notification.additionalData.ejson.rid,
          name:notification.additionalData.ejson.sender.name,
          chatType: ChatType.Chat
        });
      }
    }));

    // Register personal token
    this.subscriptions.push(pushObject.on('registration').subscribe((registration: any) => {
      this.rocketchatUserProvider.storePushToken(registration.registrationId).subscribe(console.log, console.log, console.log);
    }));

    this.subscriptions.push(pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error), console.log));

  }

  ionViewWillUnload() {
    this.subscriptions.forEach(subscription => {
      if (!isNullOrUndefined(subscription) && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  changePassword(){
    this.navController.push(ChangePasswordPage);
  }

}
