import { storeToRefs } from 'pinia';

export const useConsultant = () => {
  const { hasExperiences, hasEducations, educations, experiences } = storeToRefs(useUserStore());
  const isAddExperienceModalVisible = ref(false);

  const isAddEducationModalVisible = ref(false);

  const toggleAddExperienceModal = () => {
    isAddExperienceModalVisible.value = !isAddExperienceModalVisible.value;
  };

  const toggleAddEducationModal = () => {
    isAddEducationModalVisible.value = !isAddEducationModalVisible.value;
  };

  return {
    isAddExperienceModalVisible,
    isAddEducationModalVisible,
    hasExperiences,
    hasEducations,
    educations,
    experiences,
    toggleAddEducationModal,
    toggleAddExperienceModal,
  };
};
