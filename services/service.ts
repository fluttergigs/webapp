import {Provider} from "~/services/service.types";

export abstract class BaseService {


    protected provider: Provider;

    protected constructor(provider: any) {
        this.provider = provider
    }


    call() {

    }

}