import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Injectable()
export class ImageFilesValidationPipe implements PipeTransform {
  transform(
    value: Express.Multer.File[] | undefined,
    metadata: ArgumentMetadata,
  ) {
    if (!value || value.length === 0) return value;

    for (const file of value) {
      if (file.size > MAX_SIZE) {
        throw new BadRequestException(
          `File "${file.originalname}" exceeds the 5MB limit`,
        );
      }

      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `File "${file.originalname}" has unsupported type "${file.mimetype}". Allowed: ${ALLOWED_TYPES.join(', ')}`,
        );
      }
    }

    return value;
  }
}
