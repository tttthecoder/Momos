import { DatabaseConfig } from 'src/domains/config/database.interface';
import { JWTConfig } from 'src/domains/config/jwt.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService implements DatabaseConfig, JWTConfig {
  constructor(private configService: ConfigService) {}

  // Config ENV JWT
  getJwtSecret(): string {
    return this.configService.get<string>('ACCESS_TOKEN_SECRET');
  }
  getJwtExpirationTime(): string {
    return this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN');
  }
  getJwtRefreshSecret(): string {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET');
  }
  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN');
  }
  getJwtType(): string {
    return this.configService.get<string>('TOKEN_TYPE');
  }
  getJwtRefreshCookieKey(): string {
    return this.configService.get<string>('REFRESH_TOKEN_COOKIE_KEY');
  }
  getJwtRefreshTokenCookieMaxAge(): string {
    return this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE');
  }

  // Config ENV Redis
  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }
  getRedisPort(): number {
    return parseInt(this.configService.get<string>('REDIS_PORT'));
  }

  // Config ENV database
  getDatabaseHost(): string {
    return this.configService.get<string>('DB_HOST');
  }
  getDatabasePort(): number {
    return parseInt(this.configService.get<string>('DB_PORT'));
  }
  getDatabaseUser(): string {
    return this.configService.get<string>('DB_USERNAME');
  }
  getDatabasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DB_DATABASE');
  }
  getDatabaseSchema(): string {
    return this.configService.get<string>('DB_SCHEMA');
  }
}
