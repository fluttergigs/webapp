import { storeToRefs } from 'pinia';
import { BaseToast } from '~/core/ui/base_toast';
import { addEducationFormSchema, addExperienceFormSchema } from '~/core/validations';
import type { AddEducationRequest, AddExperienceRequest } from '~/features/users/user.types';
import { ExperienceType } from '~/features/users/user.types';

// Create a ref to store our state
let profileStateRef: ReturnType<typeof createProfileState> | null = null;

// Function that creates the state
function createProfileState() {
  const { $toast } = useNuxtApp();
  const userStore = useUserStore();
  const { hasExperiences, hasEducations, educations, experiences, $addEducation, $addExperience } =
    storeToRefs(userStore);

  // UI state
  const isAddExperienceModalVisible = ref(false);
  const isAddEducationModalVisible = ref(false);

  // Form validation state
  const isExperienceFormValid = ref(false);
  const isEducationFormValid = ref(false);

  // Loading states
  const isAddingExperience = computed(() => $addExperience.value.isLoading);
  const isAddingEducation = computed(() => $addEducation.value.isLoading);

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
      // startYear: '',
      // endYear: '',
      description: '',
      isActive: false,
      user: useAuthStore().authUser.id,
    },
  });

  watch(
    () => newExperienceFormData.value.data.isActive,
    () => {
      setTimeout(() => {
        newExperienceFormData.value.data.endDate = null;
      }, 0);
    },
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

  // UI actions
  const toggleAddExperienceModal = () => {
    isAddExperienceModalVisible.value = !isAddExperienceModalVisible.value;
  };

  const toggleAddEducationModal = () => {
    isAddEducationModalVisible.value = !isAddEducationModalVisible.value;
  };

  // Form submission
  const addExperience = async () => {
    try {
      await userStore.addExperience(newExperienceFormData.value);

      if ($addExperience.value.isSuccess) {
        ($toast as BaseToast<Notification>).info(AppStrings.experienceAddedSuccessfully);

        await useUser().getUser();
        // Reset form and close modal on success
        toggleAddExperienceModal();
        resetExperienceForm();
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
        toggleAddEducationModal();
        resetEducationForm();
      }

      if ($addEducation.value.isFailure) {
        ($toast as BaseToast<Notification>).error($addEducation.value.message as string);
      }
    } catch (error) {
      console.error('Error adding education:', error);
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
        startYear: '',
        endYear: '',
        description: '',
        isActive: false,
      },
    };
  };

  return {
    // Return all your state and methods here
    isAddExperienceModalVisible,
    isAddEducationModalVisible,
    canAddExperience: isExperienceFormValid,
    canAddEducation: isEducationFormValid,
    isExperienceFormValid,
    isEducationFormValid,
    isAddingExperience,
    isAddingEducation,
    newExperienceFormData,
    newEducationFormData,
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    //methods
    toggleAddExperienceModal,
    toggleAddEducationModal,
    addExperience,
    addEducation,
    resetExperienceForm,
    resetEducationForm,
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
