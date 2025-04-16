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

    static get learnCategories() {
        return '/learn-categories'
    }

    static get learnResources() {
        return '/learn-resources'
    }

    static jobOffersBySlug(slug: string) {
        return `/job-offers/find-by-slug/${slug}`
    }
}

export class ApiEndpoint {
    static get setting() {
        return `/api/setting`
    }

    static get companies() {
        return '/api/companies'
    }

    static get users() {
        return '/api/users'
    }

    static get jobOffers() {
        return `/api/job-offers`
    }

    static get bookmarkedJobOffers() {
        return `/api/bookmarked-joboffers`
    }

    static get getMe() {
        return '/api/users/me'
    }

    static get learnCategories() {
        return '/api/learn-categories'
    }

    static get learnResources() {
        return '/api/learn-resources'
    }
}