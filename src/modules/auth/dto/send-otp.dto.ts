import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
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
}
