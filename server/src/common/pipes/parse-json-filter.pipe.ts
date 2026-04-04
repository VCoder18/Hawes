import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonFilterPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return value;

    // Deep clone to avoid mutation issues
    const transformed = { ...value };

    // If filters is a string, parse it to object
    if (transformed.filters && typeof transformed.filters === 'string') {
      try {
        const parsed = JSON.parse(transformed.filters);
        transformed.filters = parsed;
      } catch (e) {
        throw new BadRequestException(`Invalid filters JSON: ${e.message}`);
      }
    }

    return transformed;
  }
}
