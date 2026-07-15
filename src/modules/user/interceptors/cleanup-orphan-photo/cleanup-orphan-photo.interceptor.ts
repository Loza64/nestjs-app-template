import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { UploadService } from 'src/modules/upload/services/upload/upload.service';

@Injectable()
export class CleanupOrphanPhotoInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const photoId: number | undefined = req.body?.photo?.id;

    if (!photoId) return next.handle();

    return from(this.isUnassigned(photoId)).pipe(
      switchMap((isNew) =>
        next.handle().pipe(
          catchError((err: unknown) => {
            if (isNew && this.isValidationError(err)) {
              this.uploadService.deleteFile(photoId).catch(() => void 0);
            }
            return throwError(() => err);
          }),
        ),
      ),
    );
  }

  private isValidationError(err: unknown): boolean {
    if (!(err instanceof BadRequestException)) return false;
    const response = err.getResponse();
    return (
      typeof response === 'object' &&
      response !== null &&
      Array.isArray((response as { message?: unknown }).message)
    );
  }

  private async isUnassigned(photoId: number): Promise<boolean> {
    const upload = await this.uploadService.findById(photoId).catch(() => null);
    return !upload?.user;
  }
}