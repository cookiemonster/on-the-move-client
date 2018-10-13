import {Component} from "@angular/core";
import {FormControl} from "@angular/forms";
import {ChatProvider} from "../../providers/chat.provider";
import {Channel} from "../../models/channel";
import {isNullOrUndefined} from "util";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {ChatDetailPage, ChatType} from "../chat-detail/chat-detail.page";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-group-join',
  templateUrl: 'group-join.page.html'
})
export class GroupJoinPage {

  $channels: BehaviorSubject<Channel[]> = new BehaviorSubject<any[]>([]);
  filteredChannels: Channel[] = [];

  searchFormControl: FormControl = new FormControl('');

  private subscription: Subscription;

  constructor(private chatProvider: ChatProvider,
              private navCtrl: NavController){
  }

  ionViewWillEnter() {
    this.chatProvider.getAllChannels().subscribe(channels => this.$channels.next(channels));

    this.subscription = this.searchFormControl.valueChanges.combineLatest(this.$channels)
      .map(([filter, channels]) => channels.filter(channel => {
        if(channel.name.toLowerCase().indexOf(filter.toLowerCase())>=0) return true;
        if(!isNullOrUndefined(channel.topic) && channel.topic.toLowerCase().indexOf(filter.toLowerCase())>=0) return true;
      }))
      .subscribe(channels => this.filteredChannels = channels);
    this.searchFormControl.setValue('');
  }

  ionViewWillUnload() {
    if (!isNullOrUndefined(this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  joinChannel(channel: Channel){
    this.navCtrl.push(ChatDetailPage, {
      chatId: channel._id,
      name: channel.name,
      chatType: ChatType.Channel
    });
  }


}
