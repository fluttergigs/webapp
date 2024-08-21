export class Endpoint {

    static get setting() {
        return `/setting`
    }

    static get companies() {
        return '/companies'
    }

    static get users() {
        return '/users'
    }

    static get jobOffers() {
        return `/job-offers`
    }

    static get bookmarkedJobOffers() {
        return `/bookmarked-joboffers`
    }

    static get getMe() {
        return '/users/me'
    }
}