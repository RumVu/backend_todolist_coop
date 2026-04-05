import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | null> {
  transform(value: string): Date | null {
    if (!value) return null; // Or undefined if optional

    const date = new Date(value);
    const isValid = !isNaN(date.getTime());

    if (!isValid) {
      throw new BadRequestException(
        `Validation failed: "${value}" is not a valid ISO-8601 Date string.`,
      );
    }

    return date;
  }
}
