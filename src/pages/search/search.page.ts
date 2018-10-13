import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {ItemDetailPage} from '../item-detail/item-detail.page';

import {UserProvider} from '../../providers/user.provider';
import {User} from "../../models/user";
import {ReplaySubject} from "rxjs/ReplaySubject";
import "rxjs/add/observable/from";
import "rxjs/add/operator/concatMap";
import {Subscription} from "rxjs/Subscription";
import {isNullOrUndefined} from 'util';
import {FormControl} from "@angular/forms";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/operator/mergeMap";
import {ExpertiseProvider} from "../../providers/expertise.provider";
import "rxjs/add/operator/toArray";
import "rxjs/add/operator/filter";


@Component({
  selector: 'page-search',
  templateUrl: 'search.page.html'
})
export class SearchPage {
  profileImgBase = UserProvider.profileImgBaseUrlUserId;

  $users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);


  private subscription: Subscription;
  searchFormControl: FormControl = new FormControl('');

  constructor(private navCtrl: NavController,
              private userProvider: UserProvider,
              private expertiseProvider: ExpertiseProvider) {

    this.subscription = this.searchFormControl.valueChanges.debounceTime(300)
      .map(search => search.trim())
      .filter(search => ((!isNullOrUndefined(search)) && search !== ''))
      .switchMap(search => this.userProvider.findUsers(search))
      .subscribe(users => this.$users.next(users));

    this.searchFormControl.setValue(''); //Trigger filtering
  }

  ionViewWillUnload() {
    if (!isNullOrUndefined(this.subscription) && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }


  /**
   * Navigate to the detail page for this item.
   */
  openItem(user: User) {
    this.expertiseProvider.getExpertises(user.id)
      .subscribe(userExpertises => {
        this.navCtrl.push(ItemDetailPage, {
          user: user,
          expertises: userExpertises
        });
      })
  }

}
