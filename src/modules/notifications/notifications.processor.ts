import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';

@Processor('email-queue')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  @Process('send-email')
  async handleSendEmail(job: Job) {
    this.logger.debug(`Bắt đầu quy trình gửi Email cho: ${job.data.to}`);
    this.logger.debug(`Nội dung: ${job.data.subject}`);
    
    // Giả lập thời gian server gọi sang SMTP (VD: SendGrid, NodeMailer) mất 3 giây
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    this.logger.log(`✅ Hoàn tất gửi Email tới ${job.data.to} (Job ID: ${job.id})`);
  }
}
