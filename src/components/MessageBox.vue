<script setup lang="ts">
defineProps<{message: string, type: string}>()
</script>

<template>
  <div class="bg-dark-gray w-1/2 absolute top-0 left-1/2 -translate-x-1/2 p-4 z-10 text-center rounded-bl-md rounded-br-md"
    :class="{errMessage: type === 'error', validMessage: type === 'valid'}">
    {{ message }}
  </div>
</template>

<style scoped>
.errMessage{
  @apply text-err
}

.validMessage{
  @apply text-valid
}

</style>