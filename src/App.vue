<script setup lang="ts">
import { ref, reactive } from 'vue'
import generateNewPuzzle from './utils/generateNewPuzzle'
import Puzzle from './components/Puzzle.vue'
import Navigation from './components/Navigation.vue'

const puzzleRef = ref()

let boardDim = 7
const puzzle = reactive(generateNewPuzzle(boardDim, 'Easy'))

function newPuzzle(size:string, difficulty:string){
  boardDim = parseInt(size.substring(0,size.indexOf('x')))
  Object.assign(puzzle, generateNewPuzzle(boardDim, difficulty))
}

</script>

<template>
  <div @mouseup="()=> puzzleRef?.mouseUp()">
    <Puzzle :key="puzzle.nodes[0].id" ref="puzzleRef" :board="puzzle.board" :nodes="puzzle.nodes" :boardDim="boardDim" :newPuzzleHandler="newPuzzle" />
    <Navigation :newPuzzleHandler="newPuzzle" :solveHandler="()=> puzzleRef?.checkSolved()" />
  </div>
</template>

<style scoped>
</style>
