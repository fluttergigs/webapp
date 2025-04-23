<script lang="ts" setup>
  import useCountries from '~/composables/useCountries';
  import type { Country } from '~/core/shared/types';

  const selected = ref([]);

  //@ts-ignore
  const props = defineProps({
    searchPlaceholder: {
      type: String,
      default: 'Select the work permit for this job',
    },
  });

  const { data: countries, error } = await useCountries();

  //@ts-ignore
  const emits = defineEmits(['selectedCountries']);

  watch(
    selected,
    () => {
      const selectedCountries = countries.value.filter(({ iso }: Country) =>
        selected.value.join(' ').includes(iso),
      );
      emits('selectedCountries', { countries: selectedCountries });
    },
    {
      deep: true,
    },
  );
</script>

<template>
  <client-only>
    <USelectMenu
      v-if="countries.length > 0"
      v-model="selected"
      :filter-fields="['name']"
      :items="countries || []"
      :placeholder="searchPlaceholder"
      :ui-menu="{ height: 'h-[200px]' }"
      label-key="name"
      multiple
      searchable
      size="lg"
      value-key="iso"
    >
      <!--    <template #label>
            <span :class="[selected.online ? 'bg-green-400' : 'bg-gray-200', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true" />
            <span class="truncate">{{ selected.name }}</span>
          </template>-->
      <template #empty> No countries</template>

      <template #option-empty="{ query }">
        <q>{{ query }}</q> not found
      </template>

      <template #item-label="{ item: country }">
        <div class="flex gap-3 items-center">
          <span aria-hidden="true" class="text-xl">
            {{ country?.flag?.ico }}
          </span>
          <span class="text-gray-500 font-medium text-lg">{{ country?.name }}</span>
        </div>
      </template>
    </USelectMenu>
  </client-only>
</template>
<style></style>
