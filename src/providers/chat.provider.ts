import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {Observable} from "rxjs/Observable";
import {Chat} from "../models/chat";
import {RocketChatUser} from "../models/rocket-chat-user";
import {Message} from "../models/message";
import {Channel} from "../models/channel";
import {Group} from "../models/group";
import {XAuthHttpProvider} from "./helpers/x-auth-http.provider";
import {CONFIG} from "../../app-config";
import { isNullOrUndefined } from "util";

@Injectable()
export class ChatProvider {
  private static baseUrl: string = `${CONFIG.rocketchatBaseUrl}/api/v1`;

  constructor(private http: XAuthHttpProvider) {
  }

  getUserInfo(username: string): Observable<RocketChatUser> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/users.info?username=${username}`)
      .map(res => res.user);
  }

  getPublicChannelMessages(groupId: string): Observable<Message[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.history?roomId=${groupId}`)
      .map(res => res.messages);
  }

  getPrivateGroupMessages(groupId: string): Observable<Message[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/groups.history?roomId=${groupId}`)
      .map(res => res.messages);
  }

  getChats(): Observable<Chat[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/im.list`)
      .map(res => res.ims)
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/im.history?roomId=${chatId}`)
      .map(res => res.messages);
  }

  sendChatMessage(chatId: string, text: string) {
    return this.http.post(`${ChatProvider.baseUrl}/chat.postMessage`, {roomId: chatId, text: text});
  }

  getPublicChannels(): Observable<Channel[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.list.joined`)
      .map(res => res.channels);
  }

  getPrivateGroups(): Observable<Group[]> {
    return this.http.get<any>(`${ChatProvider.baseUrl}/groups.list`)
      .map(res => res.groups);
  }

  createPublicChannel(payload: {name: string, members: string[]}){
    return this.http.post(`${ChatProvider.baseUrl}/channels.create`, payload);
  }

  createPrivateGroup(payload: {name: string, members: string[]}){
    return this.http.post(`${ChatProvider.baseUrl}/groups.create`, payload);
  }

  getChatMembers(roomId: string): Observable<RocketChatUser[]>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/im.members?roomId=${roomId}`)
      .map(res => res.members);
  }

  getChannelMembers(roomId: string): Observable<RocketChatUser[]>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.members?roomId=${roomId}`)
      .map(res => res.members);
  }

  getGroupMembers(roomId: string): Observable<RocketChatUser[]>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/groups.members?roomId=${roomId}`)
      .map(res => res.members);
  }

  getUnreadChatMessages(roomId: string, dateLatest: Date): Observable<number> {
    if(isNullOrUndefined(dateLatest))
      dateLatest = new Date(2018, 0, 1);
    dateLatest = new Date(dateLatest);
    return this.http.get<any>(`${ChatProvider.baseUrl}/im.history?roomId=${roomId}&unreads=true&oldest=${dateLatest.toISOString()}`)
      .map(res => res.unreadNotLoaded + res.messages.length);
  }

  getUnreadChannelMessages(roomId: string, dateLatest: Date): Observable<number> {
    if(isNullOrUndefined(dateLatest))
      dateLatest = new Date(2018, 0, 1);
    dateLatest = new Date(dateLatest);
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.history?roomId=${roomId}&unreads=true&oldest=${dateLatest.toISOString()}`)
      .map(res => res.unreadNotLoaded + res.messages.length);
  }

  getUnreadGroupMessages(roomId: string, dateLatest: Date): Observable<number> {
    if(isNullOrUndefined(dateLatest))
      dateLatest = new Date(2018, 0, 1);
    dateLatest = new Date(dateLatest);
    return this.http.get<any>(`${ChatProvider.baseUrl}/groups.history?roomId=${roomId}&unreads=true&oldest=${dateLatest.toISOString()}`)
      .map(res => res.unreadNotLoaded + res.messages.length);
  }

  getGroup(roomId: string): Observable<Group>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/groups.info?roomId=${roomId}`)
      .map(res => res.group)
  }

  getChannel(roomId: string): Observable<Channel>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.info?roomId=${roomId}`)
      .map(res => res.channel)
  }

  renameGroup(roomId: string, newName: string){
    return this.http.post(`${ChatProvider.baseUrl}/groups.rename`, {roomId: roomId, name: newName});
  }

  renameChannel(roomId: string, newName: string){
    return this.http.post(`${ChatProvider.baseUrl}/channels.rename`, {roomId: roomId, name: newName});
  }

  setGroupTopic(roomId: string, topic: string){
    return this.http.post(`${ChatProvider.baseUrl}/groups.setTopic`, {roomId: roomId, topic: topic});
  }

  setChannelTopic(roomId: string, topic: string){
    return this.http.post(`${ChatProvider.baseUrl}/channels.setTopic`, {roomId: roomId, topic: topic});
  }

  getAllChannels(): Observable<Channel[]>{
    return this.http.get<any>(`${ChatProvider.baseUrl}/channels.list`)
      .map(res => res.channels);
  }

  openChannel(roomId: string){
    return this.http.post(`${ChatProvider.baseUrl}/channels.open`, {roomId: roomId})
  }

  addUserToGroup(roomId: string, userId: string){
    return this.http.post(`${ChatProvider.baseUrl}/groups.invite`, {roomId: roomId, userId: userId});
  }

  addUserToChannel(roomId: string, userId: string){
    return this.http.post(`${ChatProvider.baseUrl}/channels.invite`, {roomId: roomId, userId: userId});
  }

}
