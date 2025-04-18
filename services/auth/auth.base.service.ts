export abstract class AuthService<LData, RData> {
  abstract register(data: RData): Promise<any>;

  abstract login(data: LData): Promise<any>;

  abstract logout(): Promise<void> ;

  abstract fetchUser(): Promise<any>;

  abstract resetPassword<T>(data: T): Promise<any>;

  abstract forgotPassword<T>(data: T): Promise<any>;
}