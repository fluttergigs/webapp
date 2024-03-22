export class AppRoutes {
    static login = '/auth/login'

    static register = '/auth/register'

    static postJob = '/jobs/post'

    static jobs = '/jobs/'

    static jobDetail = (slug: string) => `/jobs/${slug}`;

    static companyPage = (id: number) => `/companies/${id}`;

    static consultantDetail = (slug: string) => `/flutter-consultants/${slug}`;

    static hireConsultants = '/flutter-consultants'

    static learn = '/learn'

    static myJobs = '/account/jobs'

    static myAccount = '/account/user'

    static mySavedJobs = '/account/saved-jobs'

    static myCompany = '/account/company'

    static welcome = '/'

    static alerts = '/alerts'

    static dashboard = '/dashboard'

    static createCompany = '/companies/create'
}