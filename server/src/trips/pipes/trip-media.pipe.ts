// file-fields.pipe.ts
import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class TripMediaPipe implements PipeTransform {
  async transform(files: {
    images?: Express.Multer.File[];
    attachment?: Express.Multer.File[];
  } | undefined) {
    const normalizedFiles = files ?? {};
    const imagesPipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /^(image\/jpeg|image\/png|image\/webp)$/,
      })
      .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
      .build({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });

    const attachmentPipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType:
          /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
      })
      .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
      .build({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });

    await Promise.all([
      ...(normalizedFiles.images?.map((f) => imagesPipe.transform(f)) ?? []),
      ...(normalizedFiles.attachment?.map((f) => attachmentPipe.transform(f)) ?? []),
    ]);

    return normalizedFiles;
  }
}
