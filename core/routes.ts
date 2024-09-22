export class AppRoutes {
    static login = '/auth/login'

    static register = '/auth/register'

    static postJob = '/jobs/post'

    static jobs = '/jobs/'
    static companies = '/companies/';
    static hireConsultants = '/consultants'
    static learn = '/learn'
    static myJobs = '/account/jobs'
    static myAccount = '/account/user'
    static mySavedJobs = '/account/saved-jobs'
    static myCompany = '/account/company'
    static welcome = '/'
    static alerts = '/alerts'
    static dashboard = '/dashboard'
    static createCompany = '/companies/create'

    static jobDetail = (slug: string) => `/jobs/${slug}`;

    static companyPage = (slug: string) => `/companies/${slug}`;

    static consultantDetail = (slug: string) => `/consultants/${slug}`;

    static editJob = (slug: string) => `/jobs/edit/${slug}`;
}