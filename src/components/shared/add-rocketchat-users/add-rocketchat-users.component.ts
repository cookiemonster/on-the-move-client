import {Component, ElementRef, forwardRef, HostListener, Input} from "@angular/core";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {RocketchatUserProvider} from "../../../providers/rocketchat-user.provider";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {isNullOrUndefined} from 'util';
import {RocketChatUser} from "../../../models/rocket-chat-user";

@Component({
  selector: 'component-add-rocketchat-users',
  templateUrl: 'add-rocketchat-users.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRocketchatUsersComponent),
      multi: true
    }
  ]
})
export class AddRocketchatUsersComponent implements ControlValueAccessor {
  searchFormControl = new FormControl('');
  $users: Observable<RocketChatUser[]>;

  optionsVisible = false;

  $invitedUsers: BehaviorSubject<RocketChatUser[]> = new BehaviorSubject<RocketChatUser[]>([]);
  private _onChange: (_: any) => void;
  _onTouched: any;

  //Users that migt already be in the group.
  @Input() addedUsers: RocketChatUser[] = [];


  constructor(private rocketchatUserProvider: RocketchatUserProvider,
              private _elementRef: ElementRef) {
    this.$users = this.searchFormControl.valueChanges
      .map(value => value.trim())
      .filter(value => value !== '')
      .debounceTime(400)
      .combineLatest(this.$invitedUsers.map(users => users.map(user => user.username)))
      .switchMap(valueAndUsernames => this.rocketchatUserProvider.searchUsers(valueAndUsernames[0], [].concat(valueAndUsernames[1], this.addedUsers.map(user => user.username))));
  }

  addUser(addedUser: RocketChatUser) {
    this.$invitedUsers.take(1).subscribe(res => {
      let newResult = res.slice();
      newResult.push(addedUser);

      if (this._onChange)
        this._onChange(newResult);
      this.$invitedUsers.next(newResult);
    })
  }

  removeUser(removedUser: RocketChatUser) {
    this.$invitedUsers.take(1).subscribe(res => {
      let newResult = res.filter(user => user.username !== removedUser.username);
      if (this._onChange)
        this._onChange(newResult);
      this.$invitedUsers.next(newResult);
    })
  }

  writeValue(users: RocketChatUser[]): void {
    if(!isNullOrUndefined(users))
      this.$invitedUsers.next(users);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.optionsVisible = false;
    }
  }

}
