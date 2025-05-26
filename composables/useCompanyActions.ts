import { AppRoutes } from '~/core/routes';
import type { Company, CreateCompanyRequest } from '~/features/companies/company.types';
import { useJobStore } from '~/stores/job';
import { AnalyticsEvent } from '~/services/analytics/events';
import type { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
import type { JobOffer, JobOfferApiResponse, JobOfferEditRequest, JobPostPaymentData } from '~/features/jobs/job.types';
import type { CallbackFunction } from '~/core/shared/types';
import { BaseToast } from '~/core/ui/base_toast';
//@ts-ignore
import type { Notification } from '#ui/types';
import { useUserStore } from '~/stores/user';
import { Endpoint } from '~/core/network/endpoints';
import type { HttpClient } from '~/core/network/http_client';
import { useClipboard } from '@vueuse/core';
import { logDev } from '~/core/helpers/log';
import { stringify } from 'qs';
import { marked } from 'marked';

export default function useCompanyActions() {
  const { $analytics, $toast } = useNuxtApp();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const jobStore = useJobStore();
  const companyStore = useCompanyStore();
  const handleJobCreation = () => {
    if (userStore.hasCompanies) {
      return navigateTo(AppRoutes.postJob);
    } else {
      return navigateTo(AppRoutes.createCompany);
    }
  };

  const checkCompanyExistenceGuard = () => {
    if (!userStore.hasCompanies) {
      return navigateTo(AppRoutes.createCompany);
    } else {
      logDev('User has companies, redirecting to post job offer page');
    }
  };

  const shareCompany = async ({ slug }: Company) => {
    const { copy } = useClipboard({
      source: `${location.href}/companies/${slug}`,
      legacy: true,
    });

    await copy();
    ($toast as BaseToast<Notification, number>).info(
      'Company link copied to your clipboard. You can share it :)',
    );
  };

  const postJobOffer = async (
    onSuccess?: CallbackFunction<JobOfferApiResponse>,
  ) => {
  };

  const createCompany = async (
    data: CreateCompanyRequest,
    onSuccess?: CallbackFunction<Company>,
  ) => {
    try {
      (<AppAnalyticsProvider>$analytics).capture(
        AnalyticsEvent.companyCreationButtonClicked,
        { data },
      );
      await companyStore.createCompany({ data });
      (<AppAnalyticsProvider>$analytics).capture(
        AnalyticsEvent.successfulCompanyCreation,
        { data },
      );

      if (!!onSuccess) {
        onSuccess();
      }
    } catch (e) {
      ($toast as BaseToast<Notification>).error(
        <string>companyStore.companyCreation.message,
      );
    }
  };

  const onSuccessfulPaymentForJobPosting = async (
    onSuccess?: CallbackFunction<JobOfferApiResponse>,
  ) => {
    let jobCreationData = jobStore.jobCreationData;
    jobCreationData.hasPaid = true;
    jobStore.setJobCreationData(jobCreationData);

    (<AppAnalyticsProvider>$analytics).capture(
      AnalyticsEvent.successfulJobPostingPayment,
      jobCreationData,
    );

    await jobStore.postJob();

    if (!!onSuccess) {
      onSuccess();
    }
    ($toast as BaseToast<Notification>).custom({
      color: 'primary',
      title: jobStore.jobCreation.message,
      timeout: 20000,
      actions: jobStore.jobCreation.isSuccess
        ? [
          {
            label: 'View job',
            click: () =>
              navigateTo(
                AppRoutes.jobDetail(
                  jobStore.jobCreation.value.slug,
                ),
              ),
          },
        ]
        : null,
    });
  };

  const handleJobPosting = async () => {
    if (jobStore.jobCreationData.hasPaid || (userStore.myCompany?.hasFreeJobPosts ?? false)) {
      await onSuccessfulPaymentForJobPosting();
    } else {
      await payForJobPosting();
    }
  };

  const payForJobPosting = async () => {
    try {
      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.postJobOfferButtonClicked,
      );

      const paymentPortal = getPaymentPortalUrlForJobPosting(
        //@ts-ignore
        authStore.authUser.email,
      );

      window.open(paymentPortal, '_blank');
    } finally {
    }
  };

  const handleJobEdit = async (job: JobOffer) => {
    //@ts-ignore
    jobStore.setJobEditData(job);

    return navigateTo(AppRoutes.editJob(job.slug));
  };

  const handleJobDuplicate = async (job: JobOffer) => {
    let jobCreationData = job;
    jobCreationData.applyBefore = new Date(job.applyBefore);
    //@ts-ignore
    jobStore.setJobCreationData(jobCreationData);
    handleJobCreation();
  };

  const editJobOffer = async (
    job: JobOffer | JobOfferEditRequest,
    onDone?: CallbackFunction<any>,
  ) => {
    try {
      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.jobOfferUpdateButtonClicked,
        { job: jobStore.jobEditData },
      );

      //@ts-ignore
      await jobStore.editJobOffer(jobStore.jobEditData as JobOffer);

      ($toast as BaseToast<Notification>).custom({
        title: jobStore.jobEdit.message,
        timeout: 8000,
        actions: [
          {
            label: 'View job',

            click: () => navigateTo(AppRoutes.jobDetail(job.slug!)),
          },
        ],
      });

      if (onDone != null) {
        onDone();
      }
    } catch (e) {
    } finally {
      ($toast as BaseToast<Notification>).custom({
        color: 'primary',
        title: jobStore.jobEdit.message,
        timeout: 8000,
        actions: jobStore.jobEdit.isSuccess
          ? [
            {
              label: 'View job',
              click: () => navigateTo(AppRoutes.jobDetail(job.slug!)),
            },
          ]
          : null,
      });
    }
  };

  const hasSocialMedia = (company: Company) => {
    return !!company.linkedin || !!company.twitter;
  };

  const onCompanyCreationSuccess: CallbackFunction<Company> = async () => {
    ($toast as BaseToast<Notification>).info(
      <string>companyStore.companyCreation.message,
    );

    return navigateTo(AppRoutes.myCompany);
  };
  const fetchCompaniesJob = async (companyId: number) => {
    const { $http } = useNuxtApp();

    const query = stringify(
      {
        populate: '*',
        filters: {
          company: {
            id: {
              $eq: companyId,
            },
          },
        },
        sort: 'createdAt:desc',
      },
      {
        encodeValuesOnly: true,
      },
    );
    return await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`);
  };

  const handleJobPostedPayment = async (data: JobPostPaymentData) => {
    const { originEmail } = data;
    logDev('payment data', data);

    if (authStore.isAuthenticated && originEmail === authStore.authUser?.email) {
      await onSuccessfulPaymentForJobPosting(async function() {
          return navigateTo(AppRoutes.myJobs);
        },
      );
      await Promise.all(
        [
          useUser().getUser(),
          // @ts-ignore
          useJobStore().fetchJobs(),
        ],
      );
    }
  };

  const handleJobDescriptionGenerated = async (description: string) => {
    //check if the description is markdown

    logDev('IS MARKDOWN', description.isMarkdown());

    //@ts-ignore
    useJobStore().jobCreationData.description = description.isMarkdown()
      ? marked(description)
      : description;
  };

  return {
    handleJobDescriptionGenerated,
    handleJobEdit,
    editJobOffer,
    handleJobCreation,
    handleJobDuplicate,
    hasSocialMedia,
    checkCompanyExistenceGuard,
    postJobOffer,
    shareCompany,
    fetchCompaniesJob,
    payForJobPosting,
    handleJobPosting,
    createCompany,
    onCompanyCreationSuccess,
    onSuccessfulPaymentForJobPosting,
    handleJobPostedPayment,
  };
}
