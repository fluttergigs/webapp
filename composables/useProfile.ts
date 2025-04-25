import { storeToRefs } from 'pinia';
import { BaseToast } from '~/core/ui/base_toast';
import { addEducationFormSchema, addExperienceFormSchema, updateEducationFormSchema, updateExperienceFormSchema } from '~/core/validations';
import type { AddEducationRequest, AddExperienceRequest, Education, Experience, UpdateEducationRequest, UpdateExperienceRequest } from '~/features/users/user.types';
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
  } = storeToRefs(userStore);

  // UI state
  const isAddExperienceModalVisible = ref(false);
  const isAddEducationModalVisible = ref(false);

  const isUpdateExperienceModalVisible = ref(false);
  const isUpdateEducationModalVisible = ref(false);

  // Form validation state
  const isExperienceFormValid = ref(false);
  const isEducationFormValid = ref(false);
  const isUpdateExperienceFormValid = ref(false);
  const isUpdateEducationFormValid = ref(false);

  // Loading states
  const isAddingExperience = computed(() => $addExperience.value.isLoading);
  const isAddingEducation = computed(() => $addEducation.value.isLoading);

  const isUpdatingExperience = computed(() => $updateExperience.value.isLoading);
  const isUpdatingEducation = computed(() => $updateEducation.value.isLoading);

  const isDeletingExperience = computed(() => $deleteExperience.value.isLoading);
  const isDeletingEducation = computed(() => $deleteEducation.value.isLoading);

  //
  const selectedEducation = ref<Education>();
  const selectedExperience = ref<Experience>();

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

  watch(
    () => newExperienceFormData.value.data.isActive,
    () => {
      newExperienceFormData.value.data.endDate = null;
    },
  );

  watch(
    () => selectedExperience,
    (data) => {
      //filter out irrelevant properties from the selected experience
      //implement it here

      const { documentId, createdAt, updatedAt, publishedAt, id, ...filteredExperience } =
        data.value || {};

      updatedExperienceFormData.value = {
        //@ts-ignore
        data: {
          ...filteredExperience,
          user: useAuthStore().authUser.id,
        } as unknown as UpdateExperienceRequest,
      };
    },
    { deep: true },
  );

  watch(
    () => selectedEducation,
    (data) => {
      const { documentId, createdAt, id, updatedAt, publishedAt, ...filteredEducation } =
        data.value || {};

      updatedEducationFormData.value = {
        //@ts-ignore
        data: {
          ...filteredEducation,
          user: useAuthStore().authUser.id,
        } as unknown as UpdateEducationRequest,
      };
    },
    { deep: true },
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
    },
    { immediate: true, deep: true },
  );

  watch(
    () => newEducationFormData.value.data,
    async (newData) => {
      isEducationFormValid.value = await addEducationFormSchema.isValid(newData);
    },
    { immediate: true, deep: true },
  );

  watch(
    () => (updatedExperienceFormData.value?.data ?? {}) as Experience,
    async (newData) => {
      isUpdateExperienceFormValid.value = await updateExperienceFormSchema.isValid(newData);

      //log validation errors
      const errors = await updateExperienceFormSchema.validate(newData).catch((err) => {
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

  // UI actions
  const toggleAddExperienceModal = () => {
    isAddExperienceModalVisible.value = !isAddExperienceModalVisible.value;
  };

  const toggleAddEducationModal = () => {
    isAddEducationModalVisible.value = !isAddEducationModalVisible.value;
  };

  const toggleUpdateExperienceModal = () => {
    isUpdateExperienceModalVisible.value = !isUpdateExperienceModalVisible.value;
  };

  const toggleUpdateEducationModal = () => {
    isUpdateEducationModalVisible.value = !isUpdateEducationModalVisible.value;
  };

  const setExperience = (param: Experience) => (selectedExperience.value = param);

  const setEducation = (param: Education) => (selectedEducation.value = param);

  // Form submission
  const addExperience = async () => {
    try {
      await userStore.addExperience(newExperienceFormData.value);

      if ($addExperience.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.experienceAddedSuccessfully);

        await useUser().getUser();
        // Reset form and close modal on success
        resetExperienceForm();
        toggleAddExperienceModal();
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
        await useUser().getUser();
        // Reset form and close modal on success
        resetEducationForm();
        toggleAddEducationModal();
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
        toggleUpdateExperienceModal();
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
        toggleUpdateEducationModal();
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
        toggleUpdateExperienceModal();
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
        toggleUpdateEducationModal();
      }

      if ($deleteEducation.value.isFailure) {
        ($toast as BaseToast<Notification>).error($deleteEducation.value.message as string);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

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
      },
    };
  };

  return {
    // Return all your state and methods here
    isUpdateExperienceModalVisible,
    isUpdateEducationModalVisible,
    isAddExperienceModalVisible,
    isAddEducationModalVisible,
    canAddExperience: isExperienceFormValid,
    canAddEducation: isEducationFormValid,
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
    newExperienceFormData,
    newEducationFormData,
    updatedExperienceFormData,
    updatedEducationFormData,
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    //methods
    toggleAddExperienceModal,
    toggleAddEducationModal,
    toggleUpdateExperienceModal,
    toggleUpdateEducationModal,
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    resetExperienceForm,
    resetEducationForm,
    setExperience,
    setEducation,
    updateExperience,
    updateEducation,
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
