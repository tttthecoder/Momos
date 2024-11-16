export enum UsecasesProxyProvide {
  // Authentication
  LoginUsecase = 'LoginUsecase',
  RegisterUseCase = 'RegisterUseCase',
  LogoutUsecase = 'LogoutUsecase',
  GenerateAccessTokenFromRefreshTokenUseCase = 'GenerateAccessTokenFromRefreshTokenUseCase',

  // Scraping
  ScrapeURLs = 'ScrapeURLs',
  QueueURLs = 'QueueURLs',
  GetManyMedias = 'GetManyMedias',
  // ...
}
