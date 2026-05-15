export class OtpUtil {
  /**
   * تولید کد OTP شش رقمی
   */
  static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * محاسبه زمان انقضای OTP (5 دقیقه)
   */
  static getOtpExpiration(): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
  }

  /**
   * بررسی انقضای OTP
   */
  static isOtpExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}
