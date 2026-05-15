import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Pagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', example: 1, type: 'integer' }),
    ApiQuery({ name: 'limit', example: 10, type: 'integer' })
  );
}
