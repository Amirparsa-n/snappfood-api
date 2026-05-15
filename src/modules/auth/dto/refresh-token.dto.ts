import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh Token دریافتی از endpoint ورود',
    example: '',
  })
  @IsString({ message: 'توکن باید رشته باشد' })
  @IsNotEmpty({ message: 'توکن الزامی است' })
  refreshToken: string;
}
