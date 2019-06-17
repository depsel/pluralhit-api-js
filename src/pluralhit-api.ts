import * as amqp from 'amqplib';

//import { ERROR_BAD_REQUEST, ERROR_INVALID_PARAM_TYPE, ERROR_MALFORMED_JSON_RESULT } from './exceptions-strings';

export type MailAddress = string | { name: string; address: string };

export interface EmailMessage {
  email: {
    from: MailAddress[];
    to: MailAddress[];
    subject: string[];
    htmlBody: string[];
    sender?: MailAddress[];
    replyTo?: MailAddress[];
    textBody?: string[];
    headers?: { [key: string]: string }[];
    values?: { [key: string]: string }[];
  };
}

export class PluralhitApi {
  private readonly CHANNEL_EMAILS: string = 'emails';
  
  private hostUrl: string;

  constructor(hostUrl: string = ""){
    if (typeof hostUrl !== 'string') hostUrl = "";
    hostUrl = hostUrl.trim();
    
    if (hostUrl === '') hostUrl = 'amqp://guest:guest@localhost:5672';

    this.hostUrl = hostUrl;

  }

  async send(em: EmailMessage): Promise<void>{

    const conn: amqp.Connection = await amqp.connect(this.hostUrl);
    const channel: amqp.Channel = await conn.createChannel();

    const queue = this.CHANNEL_EMAILS;

    await channel.assertQueue(queue, {durable: false});

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(em)), {});

    await channel.close();
    await conn.close();

  }

}
