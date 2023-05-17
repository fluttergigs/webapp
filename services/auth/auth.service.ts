import {BaseService} from "~/services/service";
import {AuthProvider} from "~/services/service.types";

export class AuthService extends BaseService {
    get auth(): AuthProvider {
        return this._authProvider;
    }

    private _authProvider: AuthProvider

    constructor(authProvider: AuthProvider) {
        super(authProvider);
        this._authProvider = authProvider
    }

    changeProvider(authProvider: AuthProvider) {
        this._authProvider = authProvider
    }


}