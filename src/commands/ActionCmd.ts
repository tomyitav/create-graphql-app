export interface ActionCmd {
  parent: Parent
}

export interface Parent {
  ignoreContext: boolean | undefined
}
