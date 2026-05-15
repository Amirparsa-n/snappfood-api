import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'عنوان دسته‌بندی',
    example: 'لپ‌تاپ‌ها',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty({
    description: 'اسلاگ دسته‌بندی',
    example: 'laptops',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  slug: string;

  @ApiProperty({
    description: 'آدرس تصویر دسته‌بندی',
    example: 'https://example.com/images/laptop.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'آیا دسته‌بندی نمایش داده شود',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  show: boolean;

  @ApiProperty({
    description: 'ID دسته‌بندی والد (در صورت وجود)',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;
}
