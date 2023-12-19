<script setup lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
const { factor } = defineProps<{factor: number}>()
const value = factor;
</script>


<template>
  <vue-slider
    v-model="value"
    direction="ttb"
    @change="$emit('changed',value)"
    style="height: 100%;"
    :tooltip="'none'"
    :contained="true"
    :rail-style="{backgroundColor: '#D1CDD3'}"
    :process-style="{ backgroundColor: '#D1CDD3'}"
    :max="20"
  >
    <template v-slot:dot="{focus}">
      <div :class="['custom-dot', { focus }]">
        <span class="material-symbols-outlined p-1 bg-dark-gray rounded-full absolute">zoom_in</span>
      </div>
    </template>
  </vue-slider>
</template>

<style>
.custom-dot span{
  left: -64%;
  top: -45%;
}
</style>