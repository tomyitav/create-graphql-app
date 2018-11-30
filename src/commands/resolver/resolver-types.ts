export interface Schema {
  $schema: string
  definitions: object
}

export interface Operation {
  title: string
  type: string
  properties: object
  required: object[]
}

export interface OperationParams {
  type: string
  required: boolean
  title: string
  arguments: object[]
  defaultValue: string
}
