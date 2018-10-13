export class RocketChatUser{
  _id: string;
  type: string;
  status: string;
  active: string;
  name: string;
  utcOffset: number;
  username: string;
  emails: Array<{address: string, verified: string}>
}
