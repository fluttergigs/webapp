import { storeToRefs } from 'pinia';
import { BaseToast } from '~/core/ui/base_toast';
import { addEducationFormSchema, addExperienceFormSchema } from '~/core/validations';
import type { AddEducationRequest, AddExperienceRequest } from '~/features/users/user.types';
import { ExperienceType } from '~/features/users/user.types';

export const useProfile = () => {
  const { $toast } = useNuxtApp();

  const { hasExperiences, hasEducations, educations, experiences, $addEducation, $addExperience } =
    storeToRefs(useUserStore());
  const isAddExperienceModalVisible = ref(false);

  const isAddEducationModalVisible = ref(false);

  const isAddingExperience = computed(() => {
    return $addExperience.value.isLoading;
  });

  const isAddingEducation = computed(() => {
    return $addEducation.value.isLoading;
  });

  const canAddExperience = ref(false);
  const canAddEducation = ref(false);

  //new experience form data
  const newExperienceFormData = ref<AddExperienceRequest>({
    data: {
      title: '',
      type: ExperienceType.fullTime,
      company: '',
      startDate: new Date(),
      endDate: new Date(),
      description: '',
      isActive: false,
    },
  });

  //new education form data
  const newEducationFormData = ref<AddEducationRequest>({
    data: {
      degree: '',
      field: '',
      title: '',
      school: '',
      startYear: '',
      endYear: '',
      description: '',
      hasGraduated: false,
    },
  });

  const toggleAddExperienceModal = () => {
    isAddExperienceModalVisible.value = !isAddExperienceModalVisible.value;
  };

  const toggleAddEducationModal = () => {
    isAddEducationModalVisible.value = !isAddEducationModalVisible.value;
  };

  watch(
    newExperienceFormData,
    async () => {
      canAddExperience.value = await addExperienceFormSchema.isValid(
        newExperienceFormData.value.data,
      );
    },
    { immediate: true, deep: true },
  );

  watch(
    newEducationFormData,
    async () => {
      canAddEducation.value = await addEducationFormSchema.isValid(newEducationFormData.value.data);
    },
    { immediate: true, deep: true },
  );

  const addExperience = async () => {
    try {
      await useUserStore().addExperience(newExperienceFormData.value);

      if ($addExperience.value.isSuccess) {
        useUser().getUser();
      }

      if ($addExperience.value.isFailed) {
        ($toast as BaseToast<Notification>).error($addExperience.value.message);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const addEducation = async () => {
    try {
      await useUserStore().addEducation(newEducationFormData.value);

      if ($addEducation.value.isSuccess) {
        useUser().getUser();
      }

      if ($addEducation.value.isFailed) {
        ($toast as BaseToast<Notification>).error($addEducation.value.message);
      }
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  return {
    //state && computed properties
    isAddExperienceModalVisible,
    isAddEducationModalVisible,
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    newExperienceFormData,
    newEducationFormData,
    canAddExperience,
    canAddEducation,
    isAddingExperience,
    isAddingEducation,

    //methods
    addExperience,
    addEducation,
    toggleAddEducationModal,
    toggleAddExperienceModal,
  };
};
