export enum ErrorType {
  InvalidToken = 'INVALID_TOKEN',
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  RefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED',
  UserExists = 'USER_EXISTS',
  InvalidCurrentPassword = 'INVALID_CURRENT_PASSWORD',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  ForeignKeyConflict = 'FOREIGN_KEY_CONFLICT',
  TooManyRequests = 'TOO_MANY_REQUESTS',
}
