export class AppRoutes {
  static login = '/auth/login';

  static register = '/auth/register';

  static postJob = '/jobs/post';

  static jobs = '/jobs/';
  static companies = '/companies/';
  static hireConsultants = '/consultants';
  static fluppets = '/fluppets';
  static browseFluppets = '/fluppets/explore';
  static createFluppets = '/fluppets/create';
  static learn = '/learn';
  static myJobs = '/account/jobs';
  static myAccount = '/account/user';
  static mySavedJobs = '/account/saved-jobs';
  static myCompany = '/account/company';
  static welcome = '/';
  static alerts = '/alerts';
  static dashboard = '/dashboard';
  static createCompany = '/companies/create';
  static privacy = '/privacy';
  static terms = '/terms';
  static consultantProfile = '/account/consultant-profile';

  static resetPassword = '/auth/reset-password';
  static forgotPassword = '/auth/forgot-password';

  static jobDetail = (slug: string): string => `/jobs/${slug}`;

  static companyPage = (slug: string): string => `/companies/${slug}`;

  static consultantDetail = (slug: string): string => `/consultants/${slug}`;

  static editJob = (slug: string): string => `/jobs/edit/${slug}`;

  static fluppetDetail = (slug: string): string => `/fluppets/${slug}`;
}
