import { storeToRefs } from 'pinia';
import { createDeleteMode, createModalToggle, createUpdateModal } from '~/core/helpers';
import { BaseToast } from '~/core/ui/base_toast';
import { addEducationFormSchema, addExperienceFormSchema, updateEducationFormSchema, updateExperienceFormSchema, overviewFormSchema } from '~/core/validations';
import type { AddEducationRequest, AddExperienceRequest, Education, Experience, UpdateEducationRequest, UpdateExperienceRequest, UpdateOverviewDataRequest } from '~/features/users/user.types';
import { ExperienceType } from '~/features/users/user.types';




// Create a ref to store our state
let profileStateRef: ReturnType<typeof createProfileState> | null = null;

// Function that creates the state
function createProfileState() {
  const { $toast } = useNuxtApp();
  const userStore = useUserStore();
  const {
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    $addEducation,
    $addExperience,
    $deleteEducation,
    $deleteExperience,
    $updateEducation,
    $updateExperience,
    $updateOverviewData,

  } = storeToRefs(userStore);

  const addEducationModal = createModalToggle();
  const addExperienceModal = createModalToggle();

  const updateEducationModal = createUpdateModal<Education>();
  const updateExperienceModal = createUpdateModal<Experience>();

  const educationDeleteMode = createDeleteMode<Education>();
  const experienceDeleteMode = createDeleteMode<Experience>();

  // Form validation state
  const isExperienceFormValid = ref(false);
  const isEducationFormValid = ref(false);
  const isUpdateExperienceFormValid = ref(false);
  const isUpdateEducationFormValid = ref(false);
  const isOverviewDataFormValid = ref(false);

  // Loading states
  const isAddingExperience = computed(() => $addExperience.value.isLoading);
  const isAddingEducation = computed(() => $addEducation.value.isLoading);

  const isUpdatingExperience = computed(() => $updateExperience.value.isLoading);
  const isUpdatingEducation = computed(() => $updateEducation.value.isLoading);

  const isDeletingExperience = computed(() => $deleteExperience.value.isLoading);
  const isDeletingEducation = computed(() => $deleteEducation.value.isLoading);

  const isUpdatingOverviewData = computed(() => $updateOverviewData.value.isLoading);

  const selectedEducation = computed(() => updateEducationModal.selectedItem.value);
  const selectedExperience = computed(() => updateExperienceModal.selectedItem.value);


  // Store original data for cancel functionality
  const originalOverviewData = computed(() => ({
    bio: useAuthStore().authUser?.bio ?? '',
    username: useAuthStore().authUser?.username ?? '',
    website: useAuthStore().authUser?.website ?? '',
    portfolio: useAuthStore().authUser?.portfolio ?? '',
    twitter: useAuthStore().authUser?.twitter ?? '',
    linkedin: useAuthStore().authUser?.linkedin ?? '',
    github: useAuthStore().authUser?.github ?? '',
  }));

  // Editable overview data
  const overviewData = ref({
    bio: useAuthStore().authUser?.bio ?? '',
    username: useAuthStore().authUser?.username ?? '',
    website: useAuthStore().authUser?.website ?? '',
    portfolio: useAuthStore().authUser?.portfolio ?? '',
    twitter: useAuthStore().authUser?.twitter ?? '',
    linkedin: useAuthStore().authUser?.linkedin ?? '',
    github: useAuthStore().authUser?.github ?? '',
  });

  // Track if data has changed
  const hasOverviewDataChanged = computed(() => {
    return JSON.stringify(overviewData.value) !== JSON.stringify(originalOverviewData.value);
  });

  // Form data
  const newExperienceFormData = ref<AddExperienceRequest>({
    data: {
      title: '',
      type: ExperienceType.fullTime,
      company: '',
      startDate: new Date(),
      endDate: new Date(),
      description: '',
      isActive: false,
      user: useAuthStore().authUser.id,
    },
  });

  const newEducationFormData = ref<AddEducationRequest>({
    data: {
      degree: '',
      field: '',
      school: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      description: '',
      isActive: false,
      user: useAuthStore().authUser.id,
    },
  });

  const updatedEducationFormData = ref<UpdateEducationRequest>();

  const updatedExperienceFormData = ref<UpdateExperienceRequest>();


  //

  watch(
    () => newExperienceFormData.value.data.isActive,
    (isActive) => {
      if (isActive) {
        newExperienceFormData.value.data.endDate = null;
      }
    },
  );

  watch(
    () => newEducationFormData.value.data.isActive,
    (isActive) => {
      if (isActive) {
        newEducationFormData.value.data.endYear = null;
      }
    },
  );

  watch(
    () => selectedExperience,
    (data) => {
      if (!data.value) return;

      const { documentId, createdAt, updatedAt, publishedAt, ...filteredExperience } = data.value;

      updatedExperienceFormData.value = {
        data: {
          ...filteredExperience,
          user: useAuthStore().authUser.id,
        },
      };
    },
    { deep: true, immediate: true },
  );

  watch(
    () => selectedEducation,
    (data) => {
      if (!data.value) return;

      const { documentId, createdAt, updatedAt, publishedAt, ...filteredEducation } = data.value;

      updatedEducationFormData.value = {
        data: {
          ...filteredEducation,
          user: useAuthStore().authUser.id,
        },
      };
    },
    { deep: true, immediate: true },
  );

  /* watch(
     () => newExperienceFormData.value.data.endDate,
     () => {
       // Force validation by updating a non-date property
       const current = newExperienceFormData.value.data.isActive;
       newExperienceFormData.value.data.isActive = !current;
       setTimeout(() => {
         newExperienceFormData.value.data.isActive = current;
       }, 0);
     },
   );

   // Add watchers to force validation when dates change
   watch(
     () => newExperienceFormData.value.data.startDate,
     () => {
       // Force validation by updating a non-date property that will trigger the watcher
       const current = newExperienceFormData.value.data.isActive;
       newExperienceFormData.value.data.isActive = !current;
       setTimeout(() => {
         newExperienceFormData.value.data.isActive = current;
       }, 0);
     },
   );*/

  // Track form validation state changes

  watch(
    () => newExperienceFormData.value.data,
    async (newData) => {
      isExperienceFormValid.value = await addExperienceFormSchema.isValid(newData);

      await addExperienceFormSchema.validate(newData).catch((err) => {
        console.error('Validation errors:', err.errors);
        return err;
      });
    },
    { deep: true },
  );

  watch(
    () => newEducationFormData.value.data,
    async (newData) => {
      isEducationFormValid.value = await addEducationFormSchema.isValid(newData);
    },
    { deep: true },
  );

  watch(
    () => (updatedExperienceFormData.value?.data ?? {}) as Experience,
    async (newData) => {
      isUpdateExperienceFormValid.value = await updateExperienceFormSchema.isValid(newData);

      // Log validation errors
      await updateExperienceFormSchema.validate(newData).catch((err) => {
        console.error('Validation errors:', err.errors);
        return err;
      });
    },
    { deep: true },
  );

  watch(
    () => (updatedEducationFormData.value?.data ?? {}) as Education,
    async (newData) => {
      isUpdateEducationFormValid.value = await updateEducationFormSchema.isValid(newData);

      //
    },
    { deep: true },
  );


  watch(() => overviewData.value, async (newData) => {
    isOverviewDataFormValid.value = await overviewFormSchema.isValid(newData);

    await overviewFormSchema.validate(newData).catch((err) => {
      console.error('Validation errors:', err.errors);
      return err;
    });
  });

  // Form submission
  const addExperience = async () => {
    try {
      await userStore.addExperience(newExperienceFormData.value);

      if ($addExperience.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.experienceAddedSuccessfully);

        await useUser().getUser();
        // Reset form and close modal on success
        resetExperienceForm();
        addExperienceModal.toggle();
      }

      if ($addExperience.value.isFailure) {
        ($toast as BaseToast<Notification>).error($addExperience.value.message as string);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const addEducation = async () => {
    try {
      await userStore.addEducation(newEducationFormData.value);

      if ($addEducation.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.educationAddedSuccessfully);
        // Reset form and close modal on success
        await useUser().getUser();
        resetEducationForm();
        addEducationModal.toggle();
      }

      if ($addEducation.value.isFailure) {
        ($toast as BaseToast<Notification>).error($addEducation.value.message as string);
      }
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const updateExperience = async () => {
    try {
      await userStore.updateExperience(
        updatedExperienceFormData.value!,
        selectedExperience.value?.documentId ?? '',
      );

      if ($updateExperience.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.experienceUpdatedSuccessfully);
        await useUser().getUser();
        // Reset form and close modal on success

        updateExperienceModal.toggle();
      }

      if ($updateExperience.value.isFailure) {
        ($toast as BaseToast<Notification>).error($updateExperience.value.message as string);
      }
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const updateEducation = async () => {
    try {
      await userStore.updateEducation(
        updatedEducationFormData.value!,
        selectedEducation.value?.documentId ?? '',
      );

      if ($updateEducation.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.educationUpdatedSuccessfully);
        await useUser().getUser();
        // Reset form and close modal on success
        updateEducationModal.toggle();
      }

      if ($updateEducation.value.isFailure) {
        ($toast as BaseToast<Notification>).error($updateEducation.value.message as string);
      }
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  const deleteExperience = async () => {
    try {
      await userStore.deleteExperience(selectedExperience.value!.documentId as string);

      if ($deleteExperience.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.experienceDeletedSuccessfully);
        await useUser().getUser();
        // Reset form and close modal on success
        updateExperienceModal.toggle();
      }

      if ($deleteExperience.value.isFailure) {
        ($toast as BaseToast<Notification>).error($deleteExperience.value.message as string);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const deleteEducation = async () => {
    try {
      await userStore.deleteEducation(selectedEducation.value!.documentId as string);

      if ($deleteEducation.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.educationDeletedSuccessfully);
        await useUser().getUser();
        // Reset form and close modal on success
        updateEducationModal.toggle();
      }

      if ($deleteEducation.value.isFailure) {
        ($toast as BaseToast<Notification>).error($deleteEducation.value.message as string);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const updateOverviewData = async () => {
    try {
      const request: UpdateOverviewDataRequest = {
        data: {
          user: useAuthStore().authUser.id,
          ...overviewData.value,
        },
      };
      await userStore.updateOverviewData(request);

      if ($updateOverviewData.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.dataUpdatedSuccessfully);
        await useUser().getUser();
        // Reset the overview data to match the updated auth store data
        resetOverviewDataToOriginal();
      }

      if ($updateOverviewData.value.isFailure) {
        ($toast as BaseToast<Notification>).error($updateOverviewData.value.message as string);
      }
    } catch (error) {
      console.error('Error updating overview data:', error);
    }
  };

  // Cancel changes and revert to original data
  const cancelOverviewDataChanges = () => {
    resetOverviewDataToOriginal();
    ($toast as BaseToast<Notification>).info('Changes discarded');
  };

  // Helper function to reset overview data to original values
  const resetOverviewDataToOriginal = () => {
    overviewData.value = { ...originalOverviewData.value };
  };

  // Watch for auth store changes to sync original data
  watch(
    () => useAuthStore().authUser,
    (newAuthUser) => {
      if (newAuthUser && !hasOverviewDataChanged.value) {
        resetOverviewDataToOriginal();
      }
    },
    { deep: true }
  );

  // Helper functions
  const resetExperienceForm = () => {
    newExperienceFormData.value = {
      data: {
        title: '',
        type: ExperienceType.fullTime,
        company: '',
        startDate: new Date(),
        endDate: new Date(),
        description: '',
        isActive: false,
        user: useAuthStore().authUser.id,
      },
    };
  };

  const resetEducationForm = () => {
    newEducationFormData.value = {
      data: {
        degree: '',
        field: '',
        school: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear(),
        description: '',
        isActive: false,
        user: useAuthStore().authUser.id,
      },
    };
  };

  return {
    // Return all your state and methods here
    educationDeleteMode,
    experienceDeleteMode,
    addEducationModal,
    addExperienceModal,
    updateEducationModal,
    updateExperienceModal,
    canAddExperience: isExperienceFormValid,
    canAddEducation: isEducationFormValid,
    canUpdateOverviewData: isOverviewDataFormValid,
    canUpdateExperience: isUpdateExperienceFormValid,
    canUpdateEducation: isUpdateEducationFormValid,
    isExperienceFormValid,
    isEducationFormValid,
    isAddingExperience,
    isAddingEducation,
    isUpdatingExperience,
    isUpdatingEducation,
    isDeletingEducation,
    isDeletingExperience,
    isUpdatingOverviewData,
    newExperienceFormData,
    newEducationFormData,
    updatedExperienceFormData,
    updatedEducationFormData,
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    overviewData,
    hasOverviewDataChanged,


    //methods
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    resetExperienceForm,
    resetEducationForm,
    updateExperience,
    updateEducation,
    updateOverviewData,
    cancelOverviewDataChanges,
    resetOverviewDataToOriginal,
  };
}

// The actual composable that gets called from components
export const useProfile = () => {
  // Create the state only once when this composable is first called
  if (!profileStateRef) {
    profileStateRef = createProfileState();
  }

  return profileStateRef;
};
