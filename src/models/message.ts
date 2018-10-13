export class Message {
  _id: string;
  alias: string;
  msg: string;
  attachments: any; //?
  parseUrl: boolean;
  bot: any; //?
  groupable: boolean;
  ts: Date;
  t: string; //Type
  u: any;
  rid: string;
  mentions: any[]; //?
  channels: any[]; //?
  _updated_at: Date;
}
