import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(config: ConfigService) {
    const user = config.get<string>('SMTP_USER');
    this.transporter = nodemailer.createTransport({
      host: config.getOrThrow<string>('SMTP_HOST'),
      port: Number(config.getOrThrow<string>('SMTP_PORT')),
      secure: Number(config.get('SMTP_PORT')) === 465,
      auth: user ? { user, pass: config.get<string>('SMTP_PASS') } : undefined,
    });
    this.from = config.getOrThrow<string>('MAIL_FROM');
  }

  async send(message: MailMessage) {
    try {
      await this.transporter.sendMail({ from: this.from, ...message });
    } catch (error) {
      this.logger.error(`Failed to send email to ${message.to}`, error as Error);
      throw error;
    }
  }
}
