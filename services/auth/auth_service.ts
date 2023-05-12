import {BaseService} from "~/services/service";
import {AuthProvider} from "~/services/service.types";

export class AuthService extends BaseService {
    get auth(): AuthProvider {
        return this._authProvider;
    }


    private readonly _authProvider: AuthProvider

    constructor(authProvider: AuthProvider) {

        super(authProvider);
        this._authProvider = authProvider

    }





}