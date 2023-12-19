export function getRandom(array: any[]): any {
  if(array.length) {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export function randomChance(outOf100: number): boolean{
  return Math.floor(Math.random()*100)>outOf100
}
