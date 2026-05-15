import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { PrismaService } from '@db/prisma.service';
import { OtpUtil } from './utils/otp.util';
import { AuthMessage } from '@common/enums/authMessage.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    // حذف OTP های قبلی
    await this.prisma.otp.deleteMany({
      where: { phone },
    });

    const code = OtpUtil.generateOtpCode();

    const otp = await this.prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt: OtpUtil.getOtpExpiration(),
      },
    });

    // اینجا باید سرویس پیامک صدا زده شود
    console.log(`OTP Code For ${phone}: ${code}`);

    return {
      message: AuthMessage.OtpSent,
      data: {
        phone,
        expiresAt: otp.expiresAt,
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, code } = verifyOtpDto;

    const otp = await this.prisma.otp.findFirst({
      where: {
        phone,
        code,
        verified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otp) {
      throw new BadRequestException(AuthMessage.InvalidOtp);
    }

    // بررسی انقضا
    if (OtpUtil.isOtpExpired(otp.expiresAt)) {
      throw new BadRequestException(AuthMessage.OtpExpired);
    }

    // تایید OTP
    await this.prisma.otp.update({
      where: {
        id: otp.id,
      },
      data: {
        verified: true,
      },
    });

    // پیدا کردن یا ساخت کاربر
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    user ??= await this.prisma.user.create({
      data: {
        phone,
        username: phone,
        invite_code: this.generateInviteCode(),
      },
    });

    // تولید توکن
    const tokens = await this.generateTokens(user);

    return {
      message: AuthMessage.LoginSuccess,
      data: {
        user,
        ...tokens,
      },
    };
  }

  /**
   * تولید access token و refresh token
   */
  async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 604800,
    };
  }

  /**
   * refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return await this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('توکن نامعتبر است');
    }
  }

  async profile(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
      },
    });
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
