import {logDev} from "~/core/helpers/log";

export class Endpoint {

   static get setting() {
        return `/setting`
    }

   static get getJobs() {
        return `/jobs`
    }
}