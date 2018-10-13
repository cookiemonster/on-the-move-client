import {Chat} from "./chat";

export class Channel extends Chat{
  ts: Date;
  name: string;
  default: boolean;
  fname: string;
}
