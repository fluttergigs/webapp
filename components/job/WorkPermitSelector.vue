<script setup lang="ts">

import type {Country} from "~/core/shared/types";
import useCountries from "~/composables/useCountries";

const selected = ref([])

//@ts-ignore
const props = defineProps({
  searchPlaceholder: {
    type: String,
    default: 'Select the work permit for this job'
  }
})

const {data, error} = await useCountries();
//@ts-ignore
const emits = defineEmits(['selectedCountries'])

watch(selected, () => {
  const selectedCountries = data.value?.countries.filter(({iso}: Country) => selected.value.join(' ').includes(iso))
  emits("selectedCountries", {countries: selectedCountries})
}, {
  deep: true,
})
</script>

<template>
  <client-only>
    <USelectMenu :ui-menu="{ height: 'h-[200px]'}" v-if="data?.countries.length > 0"
                 v-model="selected"
                 size="lg"
                 :options="data!.countries"
                 :placeholder="searchPlaceholder"
                 value-attribute="iso"
                 :search-attributes="['name']"
                 searchable
                 multiple
                 option-attribute="name">
      <!--    <template #label>
            <span :class="[selected.online ? 'bg-green-400' : 'bg-gray-200', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true" />
            <span class="truncate">{{ selected.name }}</span>
          </template>-->
      <template #empty>
        No countries
      </template>

      <template #option-empty="{ query }">
        <q>{{ query }}</q> not found
      </template>

      <template #option="{ option: country }">
        <div class="flex space-x-3 items-center">
          <span aria-hidden="true" class="text-xl">
                  {{ country?.flag?.ico }}
              </span>
          <span class="text-gray-900 font-medium text-md">{{ country?.name }}</span>
        </div>
      </template>
    </USelectMenu>
  </client-only>
</template>
<style>


</style>