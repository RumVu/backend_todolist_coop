import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  @Process('send-email')
  async handleSendEmail(job: Job<any>) {
    this.logger.log(`Processing notification job ${job.id}...`);
    const { to, subject, body } = job.data;

    // Simulation of sending email
    this.logger.debug(`[SIMULATION] Sending email to: ${to}`);
    this.logger.debug(`[SIMULATION] Subject: ${subject}`);
    this.logger.debug(`[SIMULATION] Body: ${body}`);

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

    this.logger.log(`Notification job ${job.id} completed successfully.`);
    return { sent: true, sentAt: new Date().toISOString() };
  }
}
