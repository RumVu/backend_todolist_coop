import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MicroservicesController {
  private readonly logger = new Logger(MicroservicesController.name);

  // Đón nhận Request-Response từ Microservices khác (Phải Return kết quả)
  @MessagePattern('ping_check')
  handlePing(@Payload() data: any) {
    this.logger.log(
      `Tín hiệu ping_check nhận được từ Microservice bạn: ${JSON.stringify(data)}`,
    );
    return {
      status: 'PONG',
      receiveTime: new Date(),
      message: 'Hello from Coop Backend',
    };
  }

  // Đón nhận Event (Bắn rồi cháy, không cần Return)
  @EventPattern('task_statistics_export')
  handleTaskStatsExport(
    @Payload() data: { groupId: string; requestedBy: string },
  ) {
    this.logger.log(
      `📥 Bắt đầu quy trình Report ngầm (Event) cho Group: ${data.groupId}`,
    );
    // Ở đây sẽ móc nối tới Prisma báo cáo dữ liệu và bắn Email
  }
}
