import {ReplaySubject} from "rxjs/ReplaySubject";
import {Injectable} from "@angular/core";
import {User} from "../models/user";
import {Expertise} from "../models/expertise";
import {Chat} from "../models/chat";
import {RocketChatUser} from "../models/rocket-chat-user";
import {Channel} from "../models/channel";
import {Group} from "../models/group";

/**
 * Service which holds the users (almost) static resources.
 *
 */

@Injectable()
export class CurrentUserService {
  public $rocketchatUserId: ReplaySubject<string> = new ReplaySubject<string>(1);
  public $rocketchatUserToken: ReplaySubject<string> = new ReplaySubject<string>(1);
  public $rocketchatUserProfile: ReplaySubject<RocketChatUser> = new ReplaySubject<RocketChatUser>(1);
  public $userProfile: ReplaySubject<User> = new ReplaySubject<User>(1);
  public $userExpertises: ReplaySubject<Expertise[]> = new ReplaySubject<Expertise[]>(1);
  public $userChats: ReplaySubject<Chat[]> = new ReplaySubject<Chat[]>(1);
  public $userPublicChannels: ReplaySubject<Channel[]> = new ReplaySubject<Channel[]>(1);
  public $userPrivateGroups: ReplaySubject<Group[]> = new ReplaySubject<Group[]>(1);
  public $rocketChatUsers: ReplaySubject<RocketChatUser[]> = new ReplaySubject<RocketChatUser[]>(1);

}
