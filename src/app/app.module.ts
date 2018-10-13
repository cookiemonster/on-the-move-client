import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ProfileUpdatePage } from '../pages/profile-update/profile-update.page';
import { ItemDetailPage } from '../pages/item-detail/item-detail.page';
import { GroupsPage } from '../pages/groups/groups.page';
import { LoginPage } from '../pages/login/login.page';
import { SearchPage } from '../pages/search/search.page';
import { SignupPage } from '../pages/signup/signup.page';
import { TabsPage } from '../pages/tabs/tabs.page';
import { TutorialPage } from '../pages/tutorial/tutorial.page';
import { StartPage } from '../pages/start/start.page';
import { ChatPage } from '../pages/chat/chat.page';
import { ProfilePage } from '../pages/profile/profile.page';
import { ChatDetailPage } from '../pages/chat-detail/chat-detail.page';


import { UserProvider } from '../providers/user.provider';
import { ExpertiseProvider } from '../providers/expertise.provider';
import { ChatProvider } from '../providers/chat.provider';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {CurrentUserService} from "../providers/current-user.service";
import {UserDetailComponent} from "../components/shared/user-detail/user-detail.component";
import {HttpClientModule} from "@angular/common/http";
import {GroupCreatePage} from "../pages/group-create/group-create.page";
import {AngularSvgIconModule} from "angular-svg-icon";
import {XAuthHttpProvider} from "../providers/helpers/x-auth-http.provider";
import {RocketchatUserProvider} from "../providers/rocketchat-user.provider";
import {AddRocketchatUsersComponent} from "../components/shared/add-rocketchat-users/add-rocketchat-users.component";
import {Push} from "@ionic-native/push";
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

import {RocketchatRealtimeProvider} from "../providers/rocketchat-realtime.provider";
import {ChangePasswordPage} from "../pages/change-password/change-password.page";
import {ResetPasswordPage} from "../pages/reset-password/reset-password.page";
import {ChatSettingsPage} from "../pages/chat-settings/chat-settings.page";
import {GroupJoinPage} from "../pages/group-join/group-join.page";
import {GroupAddUsersPage} from "../pages/group-add-users/group-add-users.page";
import {AccordionComponent} from "../components/shared/accordion/accordion.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.


@NgModule({
  declarations: [
    MyApp,
    ProfileUpdatePage,
    ItemDetailPage,
    GroupsPage,
    LoginPage,
    SearchPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    StartPage,
    ChatPage,
    ProfilePage,
    ChatDetailPage,
    UserDetailComponent,
    GroupCreatePage,
    AddRocketchatUsersComponent,
    ChangePasswordPage,
    ResetPasswordPage,
    ChatSettingsPage,
    GroupJoinPage,
    GroupAddUsersPage,
    AccordionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularSvgIconModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfileUpdatePage,
    ItemDetailPage,
    GroupsPage,
    LoginPage,
    SearchPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    StartPage,
    ChatPage,
    ProfilePage,
    ChatDetailPage,
    GroupCreatePage,
    ChangePasswordPage,
    ResetPasswordPage,
    ChatSettingsPage,
    GroupJoinPage,
    GroupAddUsersPage
  ],
  providers: [
    Push,
    UserProvider,
    ExpertiseProvider,
    ChatProvider,
    SplashScreen,
    StatusBar,
    CurrentUserService,
    XAuthHttpProvider,
    MobileAccessibility,
    RocketchatUserProvider,
    RocketchatRealtimeProvider,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
