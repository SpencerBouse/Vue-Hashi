<script setup lang="ts">
import { ref } from 'vue'
import Selector from './Selector.vue';

defineProps<{newPuzzleHandler: any, solveHandler: any}>()

const sizeArr = ['7x7','10x10','15x15','20x20']
const size = ref('7x7')
const difficultyArr = ['Easy','Medium','Hard']
const difficulty = ref('Easy')
</script>

<template>
  <div class="bg-dark-gray nav h-screen max-[700px]:bg-gray">
    <div class="text-center pl-6 pr-6 max-[700px]:bg-dark-gray max-[700px]:w-screen">
      <h1 class='text-7xl font-gasoek text-center border-b-4 border-solid pb-1 pl-2 pr-2'>Hashi</h1>
    </div>

    <div class="w-9/12 min-[700px]:mx-auto min-[700px]:mt-8 text-lg max-[700px]:bg-dark-gray max-[700px]:w-screen max-[700px]:p-4">
      <div class="min-[700px]:w-full mb-2">
        <Selector label="Size" :options="sizeArr" v-model="size" />
      </div>

      <div class="min-[700px]:w-full mb-4">
        <Selector label="Difficulty" :options="difficultyArr" v-model="difficulty" />
      </div>

      <div class="max-[700px]:text-center">
        <button class="button" @click="solveHandler()">Done</button>
        <div class="inline-block scale-y-[3] -translate-y-2 mx-2 text-light-gray">|</div>
        <button class="button" @click="newPuzzleHandler(size, difficulty)">New Puzzle</button>
      </div>
    </div>

    <div class="text-right text-sm mt-auto w-9/12 mx-auto min-[700px]:mb-4 pt-8 text-muted-gray max-[700px]:bg-dark-gray max-[700px]:w-screen max-[700px]:p-4">
      <a href="https://github.com/SpencerBouse" target="_blank" class="block">my github</a>
      <a href="https://en.wikipedia.org/wiki/Hashiwokakero" target="_blank" class="block">about Hashiwokakero puzzles</a>
    </div>  
  </div>
</template>

<style scoped>
.scalebig{
  transform: scale(3)
}
.button{
  @apply text-lg bg-gray rounded p-2 m-1 border-2 border-solid border-gray;
}
.button:hover{
  @apply border-accent;
}

a:hover{
  text-decoration: underline;
}
.nav{
  @apply w-fit float-right pt-2 flex flex-col;
}
@media screen and (max-width:700px) {
  .nav {
    @apply w-screen pt-0
  }
}
</style>