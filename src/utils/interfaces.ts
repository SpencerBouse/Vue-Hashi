export interface Cell {
  index: number,
  x: number,
  y: number,
  adjacent: boolean,
  nodeId: number | null,
  bridge: boolean | number,
  value: number,
}

export interface Node {
    id: number,
    generated: boolean,
    links: Link[]
}

export interface Link {
  position: string,
  node: number | null,
  value: number | null,
}