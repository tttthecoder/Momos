export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  getJwtRefreshSecret(): string;
  getJwtRefreshExpirationTime(): string;
  getJwtType(): string;
  getJwtRefreshCookieKey(): string;
  getJwtRefreshTokenCookieMaxAge(): string;
}
