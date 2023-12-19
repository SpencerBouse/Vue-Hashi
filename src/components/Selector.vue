<script setup lang="ts">
const props = defineProps<{ label: string, options: string[], modelValue: any }>()
defineEmits(['update:modelValue'])

</script>

<template>
  <span class="w-1/2 inline-block">{{ label }}:</span>

  <select class="w-1/2 inline-block select" :value="props.modelValue" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <option v-for="option in options" :value="option">{{ option }}</option>
  </select>
</template>

<style scoped>
.select{
  @apply text-dark-gray p-1 rounded border-4 border-solid border-lighter-gray;
}
.select:focus{
  @apply bg-white border-accent;
}
.select:hover{
  @apply bg-white border-accent;
}

</style>