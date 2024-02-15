import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { FROM_EMAIL, SETTINGS } from './mail.constants';

interface ISendMessage {
  email: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private client;
  constructor() {
    this.client = nodemailer.createTransport(SETTINGS);
  }
  async sendMessage({ email, html, subject }: ISendMessage) {
    await this.client.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });
  }
}
