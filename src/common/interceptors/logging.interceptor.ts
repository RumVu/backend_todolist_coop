import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const defaultCtx = context.switchToHttp();
    const request = defaultCtx.getRequest<Request>();
    const response = defaultCtx.getResponse<Response>();

    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const endTime = Date.now();
        const duration = endTime - startTime;

        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${userAgent} ${ip}`,
        );
      }),
    );
  }
}
