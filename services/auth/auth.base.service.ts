export abstract class AuthService<
  LoginData,
  RegistrationData,
  ResetPasswordData,
  ForgotPasswordData,
> {
  abstract register(data: RegistrationData): Promise<any>;

  abstract login(data: LoginData): Promise<any>;

  abstract logout(): Promise<void>;

  abstract fetchUser(): Promise<any>;

  abstract resetPassword(data: ResetPasswordData): Promise<any>;

  abstract forgotPassword(data: ForgotPasswordData): Promise<any>;
}
