import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'شماره موبایل کاربر',
    example: '09123456789',
    pattern: '^09[0-9]{9}$',
    minLength: 11,
    maxLength: 11,
  })
  @IsString({ message: 'شماره موبایل باید رشته باشد' })
  @Matches(/^09[0-9]{9}$/, {
    message: 'فرمت شماره موبایل صحیح نیست',
  })
  @Length(11, 11, { message: 'شماره موبایل باید ۱۱ رقم باشد' })
  phone: string;

  @ApiProperty({
    description: 'کد تایید ۶ رقمی ارسال شده به موبایل',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'کد تایید باید رشته باشد' })
  @Length(6, 6, { message: 'کد تایید باید ۶ رقم باشد' })
  code: string;
}
