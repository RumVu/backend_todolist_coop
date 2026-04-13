import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponsePayload {
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((res) => {
        const payload = this.normalizeResponse(res);
        return {
          statusCode: response.statusCode,
          ...payload,
        };
      }),
    );
  }

  private normalizeResponse(res: unknown) {
    if (!this.isPlainObject(res)) {
      return {
        message: 'Success',
        data: res ?? null,
      };
    }

    const { message, data, ...rest } = res;

    return {
      message: typeof message === 'string' ? message : 'Success',
      data: data ?? null,
      ...rest,
    };
  }

  private isPlainObject(value: unknown): value is ResponsePayload {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
