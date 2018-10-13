import {Chat} from "./chat";

export class Group extends Chat {
  name: string;
  fname: string;
  u: any; //??
  customFields: any; //??
  ts: Date;
  ro: boolean;
  sysMes: boolean;
}
