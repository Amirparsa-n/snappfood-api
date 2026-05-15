export interface JwtPayload {
  sub: string; // userId
  phone: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
