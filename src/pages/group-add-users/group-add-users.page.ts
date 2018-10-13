import {Component} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {ChatProvider} from "../../providers/chat.provider";
import {AlertController, NavController, NavParams} from "ionic-angular";
import {ChatType} from "../chat-detail/chat-detail.page";
import {RocketChatUser} from "../../models/rocket-chat-user";


@Component({
  selector: 'page-group-add-users',
  templateUrl: 'group-add-users.page.html'
})
export class GroupAddUsersPage {
  form: FormGroup;
  currentUsers: RocketChatUser[] = [];

  private chatId: string;
  private chatType: ChatType;

  private loadingUsers: boolean = true;

  constructor(formBuilder: FormBuilder,
              navParams: NavParams,
              private chatProvider: ChatProvider,
              private navController: NavController,
              private alertController: AlertController) {

    this.chatId = navParams.get('chatId');
    this.chatType = navParams.get('chatType');

    let $users;
    if (this.chatType == ChatType.Group) {
      $users = this.chatProvider.getGroupMembers(this.chatId);
    } else {
      $users = this.chatProvider.getChannelMembers(this.chatId);
    }
    $users.subscribe(users => {
      this.currentUsers = users;
      this.loadingUsers = false;
    });

    this.form = formBuilder.group({
      'users': [[]]
    });
  }

  save() {
    Observable.forkJoin(
      Observable.from(this.form.value.users)
        .flatMap((user: RocketChatUser) => this.$addUser(user._id))
        .toArray()
    ).subscribe(() => this.navController.pop(),
      err => {
        this.alertController.create({
          title: 'Error',
          subTitle: 'Er is iets mis gegaan. Mogelijk heb je hiervoor geen rechten.',
          buttons: ['Ok']
        }).present();
      });

  }

  $addUser(userId: string) {
    if (this.chatType == ChatType.Group) {
      return this.chatProvider.addUserToGroup(this.chatId, userId);
    } else {
      return this.chatProvider.addUserToChannel(this.chatId, userId);
    }
  }

}
