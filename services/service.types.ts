import {StrapiAuthenticationData, StrapiAuthProvider} from "@nuxtjs/strapi/dist/runtime/types";
import {useStrapiAuth} from "@nuxtjs/strapi/dist/runtime/composables/useStrapiAuth";



const strapiAuth = useStrapiAuth()

export interface Provider {
    name: string,
}


export interface  AuthProvider extends  Provider{
    provider: typeof strapiAuth
}


function f() {

}