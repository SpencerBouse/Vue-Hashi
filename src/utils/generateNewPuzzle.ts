import {getRandom,randomChance} from './helpers'
import {Cell, Link} from './interfaces'

class Node {
  static lastId: number
  id: number = Node.incrId()
  generated: boolean = false
  links: Link[] = [
    {position: 'top', node: null, value: null},
    {position: 'right', node: null, value: null},
    {position: 'bottom', node: null, value: null},
    {position: 'left', node: null, value: null}
  ]

  static incrId() {
    if(!this.lastId){
      this.lastId = 1
    }else{
      this.lastId++
    }
    return this.lastId
  }
}

function generateNewPuzzle(boardDim: number, difficulty: string ): {board: Cell[], nodes:Node[]} {
  // generate first Node
  const nodeArray: Node[] = []
  const boardArray: Cell[] = newBoard(boardDim)
  const firstIndex = Math.floor(Math.random() * boardArray.length)
  const difficultyMod = difficulty==='Easy'? 75 : difficulty==='Medium' ? 50  : 25

  createNode(firstIndex, boardArray, nodeArray, boardDim)
  
  while(nodeArray.filter(node=>!node.generated).length){
    // node.generated === false, means the node has been created but its links have not
    nodeArray.filter(node=>!node.generated).map(node=>{
      return generateNode(node, boardArray, boardDim, nodeArray, difficultyMod)
    })
  }

  return {board: boardArray, nodes: nodeArray}
}

function newBoard(boardDim: number): Cell[]{
  return Array(Math.pow(boardDim,2)).fill('').map((_,index)=>{
    return {index: index,
            x: index%boardDim + 1,
            y: Math.floor(index/boardDim) + 1,
            adjacent: false,
            nodeId: null, 
            bridge: false,
            value: 0}
  })
}

function generateNode(node: Node, board: Cell[], boardDim: number, nodes: Node[], difficultyMod: number){
  const parentCell = board.find(cell=> cell.nodeId === node.id)
  const cellIndex = parentCell ? board.indexOf(parentCell) : null
  
  if((cellIndex !== null) && parentCell){
    node.links.forEach(link => {
      if(!link.node){
        const avalCells: Cell[] = []
        let newPosition = ''
        let index = cellIndex + 1

        switch (link.position) {
          case 'top':
            newPosition = 'bottom'

            while((index-boardDim)>0){
              let cell = board[(index -= boardDim)-1]

              if(cell.bridge) break
              if(!cell.adjacent) avalCells.push(cell)
              if(cell.nodeId) break
            }
            break
          case 'right':
            newPosition = 'left'
            index += 1
            while(index <= parentCell.y*boardDim){
              let cell = board[(index++)-1]

              if(cell.bridge) break
              if(!cell.adjacent) avalCells.push(cell)
              if(cell.nodeId) break
            }
            break
          case  'bottom':
            newPosition = 'top'

            while((index+boardDim)<=(Math.pow(boardDim,2))){
              let cell = board[(index += boardDim) -1]

              if(cell.bridge) break
              if(!cell.adjacent) avalCells.push(cell)
              if(cell.nodeId) break
            }
            break
          case 'left':
            newPosition = 'right'
            index -= 1
            while((index-1) >= ((parentCell.y-1)*boardDim) +1){
              let cell = board[(index--)-1]

              if(cell.bridge) break
              if(!cell.adjacent) avalCells.push(cell)
              if(cell.nodeId) break
            }
            break
        }

        if(avalCells.length){
          if((nodes.length<boardDim ? true : randomChance(difficultyMod))){
            const cell = getRandom(avalCells)
            const linkValue = randomChance(difficultyMod) ? 1 : 2
            
            if(cell){
              const newNode = cell.nodeId ? nodes.find(node=>node.id === cell.nodeId) : createNode(cell.index, board, nodes, boardDim)

              if(newNode){
                const newNodeLink = newNode.links.find(lnk=> lnk.position === newPosition)

                link.node = newNode.id
                link.value = linkValue
                parentCell.value += linkValue
                if(newNodeLink) {
                  newNodeLink.node = node.id
                  newNodeLink.value = linkValue
                  cell.value += linkValue
                } 

                createBridges(node.id, newNode.id, board, boardDim)
              }
            }
          }
        }
        
      }
    })
  }
  node.generated = true
  return node
}

function createNode(index: number, board: Cell[], nodes: Node[], boardDim: number): Node{
  const node = new Node()

  nodes.push(node)
  board[index].nodeId = node.id

  // update adjacent node spaces
  const indices = [
    (index-boardDim)+1>0 ? index-boardDim : null, 
    (index+1)%boardDim!==0 ? index+1: null, 
    (index+boardDim)+1<=Math.pow(boardDim,2) ? index+boardDim : null, 
    (index+1)%boardDim!==1 ? index-1 : null]

  indices.forEach(index=>{
    if(index !== null) board[index].adjacent = true
  })

  return node
}

function createBridges(firstId: number, secondId: number, board: Cell[], boardDim: number){
  const firstCell = board.find(cell=> cell.nodeId === firstId)
  const secondCell = board.find(cell=> cell.nodeId === secondId)

  if(firstCell && secondCell){
    const xDiff = Math.abs(firstCell.x - secondCell.x)
    const increment = xDiff ? 1 : boardDim

    let start = Math.min(firstCell.index, secondCell.index) + increment
    const end = Math.max(firstCell.index, secondCell.index)

    while(start<end){
      board[start].bridge = true
      start += increment
    }
  }
}

export default generateNewPuzzle;