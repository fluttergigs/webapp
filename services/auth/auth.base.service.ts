import {LoginData, RegistrationData, ResetPasswordData,} from "~/services/auth/auth.types";


export abstract class AuthService<LData, RData> {

    abstract async register(data: RData);

    abstract async login(data: LData);

    abstract async logout(): Promise<void> ;

    abstract async fetchUser(): Promise<any>;

    abstract async resetPassword(data: ResetPasswordData);
}