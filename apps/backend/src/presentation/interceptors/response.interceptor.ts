import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedSuccessResponseDto } from '../dtos/paginated-success-response.dto';
import { SuccessResponseDto } from '../dtos/success-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<T, SuccessResponseDto<T> | PaginatedSuccessResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponseDto<T> | PaginatedSuccessResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof SuccessResponseDto) {
          return new SuccessResponseDto<T>({
            ...data,
            service: this.formatServiceName(context),
          });
        }

        if (data?.paginate) {
          const { currentPage, perPage, total, lastPage } = data.paginate;

          return new PaginatedSuccessResponseDto<T>({
            service: this.formatServiceName(context),
            paginate: {
              currentPage,
              perPage,
              total,
              nextPage: currentPage < lastPage ? currentPage + 1 : null,
              prevPage: currentPage > 1 ? currentPage - 1 : null,
              lastPage,
            },
            registers: data.data,
          });
        }

        return new SuccessResponseDto<T>({
          service: this.formatServiceName(context),
          message: data?.message ?? undefined,
          registers: data?.data ?? null,
        });
      })
    );
  }

  private formatServiceName(context: ExecutionContext): string {
    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    return `${controller}.${handler}`;
  }
}
