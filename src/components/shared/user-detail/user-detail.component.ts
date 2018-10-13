import {User} from "../../../models/user";
import {Component, Input} from "@angular/core";
import {RocketChatUser} from "../../../models/rocket-chat-user";

@Component({
  selector: 'component-user-detail',
  templateUrl: 'user-detail.component.html'
})
export class UserDetailComponent {
  @Input() user: User;
  @Input() rocketchatUser: RocketChatUser;
}
