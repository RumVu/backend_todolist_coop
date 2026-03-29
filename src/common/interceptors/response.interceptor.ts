import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((res) => {
        // Inject statusCode into the response payload automatically
        if (typeof res === 'object' && res !== null) {
          return {
            statusCode: response.statusCode, // ví dụ: 200, 201
            ...res,
          };
        }

        // Fallback for simple string/primitive returns
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data: res,
        };
      }),
    );
  }
}
