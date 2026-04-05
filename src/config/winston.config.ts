import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface LogInfo {
  timestamp: string;
  level: string;
  message: string;
  context?: string | Record<string, any>;
  trace?: string | Record<string, any>;
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info: winston.Logform.TransformableInfo) => {
    const { timestamp, level, message, context, trace } =
      info as unknown as LogInfo;
    const contextStr =
      typeof context === 'object'
        ? JSON.stringify(context)
        : context || 'Application';
    const traceStr = trace
      ? typeof trace === 'object'
        ? `\n${JSON.stringify(trace)}`
        : `\n${trace}`
      : '';

    return `${timestamp} [${level.toUpperCase()}] [${contextStr}] ${message}${traceStr}`;
  }),
);

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // Console log with colors for development
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // Rotating file logs for production (saves to logs/ folder)
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
    }),
    // Separate file for Errors only
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: logFormat,
    }),
  ],
});
