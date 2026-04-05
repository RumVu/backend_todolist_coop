import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type !== 'custom' &&
      typeof value === 'object' &&
      value !== null
    ) {
      return this.trimObj(value);
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }

  private trimObj(obj: any): any {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = this.trimObj(obj[key]);
      }
    }
    return obj;
  }
}
