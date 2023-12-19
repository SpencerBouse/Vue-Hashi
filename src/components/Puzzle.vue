<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Cell, Node} from '../utils/interfaces'
import MessageBox from './MessageBox.vue';
import Slider from './Slider.vue';

class Bridge {
  static lastId: number
  id: number = Bridge.incrId()
  startNode: Cell
  endNode: Cell
  value: number = 0
  axis: string
  cells: Cell[]

  constructor(startNode: Cell, endNode: Cell, value: number, axis: string, cells: Cell[]){
    this.startNode = startNode
    this.endNode = endNode
    this.value = value
    this.axis = axis
    this.cells = cells
  }

  buildBridge(){
    this.value = 1
    this.cells.forEach(cell=>{
      if(cell){
        cell.bridge = this.id
        cellRefs.value[cell.index].children[0].classList.add(`${this.axis}Bridge`)
      }
    })
  }

  incrementValue(){
    this.value = (this.value + 1) <= 2 ? this.value + 1 : 0
    if(this.value === 2){
      this.doubleBridge()
    }else if(this.value === 0){
      this.removeBridge()  
    }
  }

  doubleBridge(){
    this.cells.forEach(cell=>{
      cellRefs.value[cell.index].children[0].classList.add(`double${this.axis.toUpperCase()}`)
      //
    })
  }

  removeBridge(){
    this.cells.forEach(cell=>{
        cell.bridge = 0
        cellRefs.value[cell.index].children[0].classList.remove('xBridge','doubleX','yBridge','doubleY')
      })
  }

  static incrId() {
    if(!this.lastId){
      this.lastId = 1
    }else{
      this.lastId++
    }
    return this.lastId
  }
}

const {board, nodes, boardDim} = defineProps<{ board: Cell[], nodes: Node[], boardDim: number, newPuzzleHandler: any}>()
const bridges: Bridge[] = []
const grid = ref<HTMLElement>()
const cellRefs = ref<HTMLElement[]>([])
const factor = ref<number>(15)
const showMessage = ref<boolean>(false)
const showSlider = ref<boolean>(true)

let message:string = ''
let messageType: string = 'error'
let startNode: any = null
let targetNode: Cell | null = null
let axis: string = 'x'
let cellsBetween: Cell[] = [] 

board.forEach(cell=> cell.bridge = 0)

onMounted(()=>{
  window.addEventListener("resize", screenResize);
  grid.value?.classList.add(`grid-cols-${boardDim}`,`grid-rows-${boardDim}`)
  screenResize()
})

function screenResize(){
  const width = window.innerWidth
  
  if(width <= 700){
    factor.value = 5
    showSlider.value = false
  }else if(width <= 850){
    factor.value = 5
    showSlider.value = false
  }else if(width <= 1000){
    factor.value = 15
    showSlider.value = true
  }else if(width <= 1150){
    factor.value = 20
    showSlider.value = true
  }else {

  }  
}

function mouseDown(cell: Cell){
  if(cell.nodeId){
    const node = nodes.find(node=> node.id === cell.nodeId)
    startNode = {cell: cell, node: node }
    cellRefs.value[startNode.cell.index].children[0].classList.add('focused')
  }
}

function mouseOver(cell: Cell){
  if(startNode) {
    let index = startNode.cell.index
    let dir: string = ''
    if((startNode.cell.x === cell.x) && (startNode.cell.y > cell.y)) dir = 'top'
    if((startNode.cell.x < cell.x) && (startNode.cell.y === cell.y)) dir = 'right'
    if((startNode.cell.x === cell.x) && (startNode.cell.y < cell.y)) dir = 'bottom'
    if((startNode.cell.x > cell.x) && (startNode.cell.y === cell.y)) dir = 'left'

    cellsBetween = []
    board.filter(cell=>cell.nodeId).forEach(cell=>{
      if(startNode.cell.index !== cell.index){
        cellRefs.value[cell.index].children[0].classList.remove('focused')
      }
    })

    switch (dir) {
      case 'top':
        axis = 'y'
        while(index>0){
          const currCell = board[(index -= boardDim)]
          
          if(currCell?.bridge) break;
          if(currCell?.nodeId){
            cellRefs.value[index].children[0].classList.add('focused')
            targetNode = currCell
            break;
          }
          cellsBetween.push(currCell)
        }
        break;
      case 'right':
        axis = 'x'
        while(index <= cell.y*boardDim){
          index++
          const currCell = board[index]
          
          if(currCell?.bridge) break;
          if(currCell?.nodeId){
            cellRefs.value[index].children[0].classList.add('focused')
            targetNode = currCell
            break;
          }
          cellsBetween.push(currCell)
        }
        break;
      case 'bottom':
        axis = 'y'
        while(index<=(Math.pow(boardDim,2))){
          const currCell = board[(index += boardDim)]
          
          if(currCell?.bridge) break;
          if(currCell?.nodeId){
            cellRefs.value[index].children[0].classList.add('focused')
            targetNode = currCell
            break;
          }
          cellsBetween.push(currCell)
        }
        break;
      case 'left':
        axis = 'x'
        while(index >= ((cell.y-1)*boardDim)){
          index--
          const currCell = board[index]
          
          if(currCell?.bridge) break;
          if(currCell?.nodeId){
            cellRefs.value[index].children[0].classList.add('focused')
            targetNode = currCell
            break;
          }
          cellsBetween.push(currCell)
        }
        break;
    }
  }
}
function touchMove(event: TouchEvent){
  const touchCell = board.find(cel=> cel.index === parseInt((document.elementFromPoint(event?.touches[0].pageX, event?.touches[0].pageY) as any)?.attributes?.index?.value))

  if(touchCell) mouseOver(touchCell)
}

function mouseUp(){
  board.filter(cell=>cell.nodeId).forEach(cell=>{
    cellRefs.value[cell.index].children[0].classList.remove('focused')
  })

  if(targetNode){
    newBridge(startNode.cell, targetNode, 1, axis, cellsBetween)
  }

  if(startNode){
    cellRefs.value[startNode.cell.index].children[0].classList.remove('focused')
    startNode = null
  }

  if(targetNode) targetNode = null
}

function click(cell:Cell){
  if(cell.nodeId){
    cellRefs.value[cell.index].children[0].classList.toggle('strike')
  }
}

function handleBridges(cell: Cell){
  if(cell.bridge){
    const bridge = bridges.find(b=> b.id === cell.bridge)
    if(bridge){
      bridge.incrementValue()
      if(!bridge.value) bridges.splice(bridges.indexOf(bridge),1)
    }
  }else{
    const {targetNode:xUpperNode, cells:xPosCells} = findNode(Array(Math.abs((cell.x-1) - boardDim)).fill('').map((_,i)=> board[i+cell.index]))
    const {targetNode:xLowerNode, cells:xNegCells} = findNode(Array(cell.x).fill('').map((_,i)=> board[cell.index-i]))
    const {targetNode:yUpperNode, cells:yPosCells} = findNode(Array(Math.abs(cell.y - boardDim)).fill('').map((_,i)=> board[(i*boardDim)+cell.index+boardDim]))
    const {targetNode:yLowerNode, cells:yNegCells} = findNode(Array(Math.abs(cell.y)).fill('').map((_,i)=> board[cell.index-((i+1)*boardDim)]))
    
    const xCells = xNegCells.reverse().concat([cell, ...xPosCells])
    const yCells = yNegCells.reverse().concat([cell, ...yPosCells])
    
    if((xUpperNode.nodeId && xLowerNode.nodeId) && ((xCells.length <= yCells.length) || (!yUpperNode.nodeId || !yLowerNode.nodeId))){
      newBridge(xLowerNode, xUpperNode, 1, 'x', xCells)
    }else if((yUpperNode.nodeId && yLowerNode.nodeId)){
      newBridge(yLowerNode, yUpperNode, 1, 'y', yCells)
    }
  }
}

function findNode(array: Cell[]): {targetNode: Cell, cells: Cell[]} {
  const cells = <Cell[]>[] 
  let targetNode = <Cell>{}
  for (const cell of array) {
    if(cell){
      if(cell.bridge) break
      if(cell.nodeId) {
        targetNode = cell
        break
      }
      cells.push(cell)
    }
  }
  return {targetNode, cells}
}

function newBridge(startNode:Cell, targetNode:Cell, value:number, axis:string, cellsBetween: Cell[]){
  const bridge = new Bridge(startNode, targetNode, value, axis, cellsBetween)
  bridges.push(bridge)
  bridge.buildBridge()
}

function checkSolved(){
  const solvedNodes = board.filter(cell=> (cell.nodeId && cell.value === bridges.filter(b=> {
      return (b.startNode.nodeId === cell.nodeId || b.endNode.nodeId === cell.nodeId)
    }).reduce((acc,curr)=> acc += curr.value,0) ))
  const unsolvedNodes = board.filter(cell=> (cell.nodeId && !solvedNodes.includes(cell)))

  board.forEach(cell=>{
    cellRefs.value[cell.index].children[0].classList.remove('error')
  })
  
  if(solvedNodes.length === nodes.length){
    message = 'Congratulations!'
    messageType = 'valid'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 5000)
  }else if(solvedNodes.length !== nodes.length){
    message = 'Puzzle contains mistakes.'
    messageType = 'error'
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 5000)

    unsolvedNodes.forEach(cell=>{
      cellRefs.value[cell.index].children[0].classList.add('error')
    })
  }
}

defineExpose({
  mouseUp,
  checkSolved
})

</script>

<template>
  <div class="w-screen" >
    <Transition>
      <MessageBox v-if="showMessage" :message="message" :type="messageType" />
    </Transition>
    <div v-if="showSlider" class="absolute left-4 top-1/2 -translate-y-1/2 h-44">
      <Slider @changed="(value)=> factor = value" :factor="factor"/>
    </div>
    <div class="puzzle max-[1300px]:left-[40%] max-[1000px]:left-[35%] max-[850px]:left-[32%] max-[700px]:left-[50%]">
      <div ref="grid" class="grid bg-lighter-gray p-1 w-[32rem] aspect-square max-[700px]:w-[25rem] max-[450px]:w-[20rem] border-4 border-solid border-dark-gray rounded select-none"
        :style="{ transform: 'scale('+ (0.5 + (factor * .03)) + ')' }">

        <div v-for="(cell) in board" ref="cellRefs"
          :key="cell.index" 
          :id="'cell'+cell.index" 
          class='text-center h-full w-full relative cell' 
          :class="{smallB: (boardDim===20 || boardDim===15), largeB: (boardDim===10 || boardDim===7)}"
          @mouseup="mouseUp()"
          @touchend="mouseUp()"
          @mouseover="mouseOver(cell)"
          @touchmove="(event)=> touchMove(event)"
          @contextmenu.prevent="(e)=> e.preventDefault()" >
          <div v-if="cell.nodeId" class="node" :index="cell.index" 
            @mousedown="mouseDown(cell)" 
            @touchstart="mouseDown(cell)"
            @click="click(cell)" 
            :class="{small: boardDim===20, medium: boardDim===15, large: boardDim===10, xLarge: boardDim===7}">
            <div class="font-bold text-sm pointer-events-none">{{ cell.value }}</div>
          </div>
          <span v-else :index="cell.index" @click="handleBridges(cell)" class="w-full h-full inline-block">&nbsp;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>