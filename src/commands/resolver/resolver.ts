import { AbstractCommand } from '../abstract-command'
import * as transform from 'graphql-json-schema'
import { Operation, OperationParams, Schema } from './resolver-types'
import {
  gqlMethodSignature,
  keysToGenerate,
  operationPrefix,
  operationSuffix,
  resolverPrefix,
  resolverSuffix
} from './resolver-constants'

export class Resolver extends AbstractCommand {
  public getName(): string {
    return 'resolver <path-to-type>'
  }

  public getAction(): (...args: any[]) => void {
    return async (pathToType: string) => {
      const schema = this.getSchemaByFilePath(pathToType)
      const schemaJsonRepresentation = transform(schema)
      return this.resolverContentByJsonSchema(schemaJsonRepresentation)
    }
  }

  public getAlias(): string {
    return 'r'
  }

  public getDescription(): string {
    return 'Generate new resolver by path to type file'
  }

  private resolverContentByJsonSchema(jsonSchema: Schema): string {
    const schemaDefinitions = jsonSchema.definitions
    let resolverContent = resolverPrefix
    Object.entries(schemaDefinitions).forEach(([key, operation]: [string, Operation]) => {
      if (keysToGenerate.includes(key)) {
        resolverContent += this.getTypeOperationContent(operation)
      }
    })
    resolverContent += resolverSuffix
    return resolverContent
  }

  private getTypeOperationContent(operation: Operation): string {
    let opStrRepresentation = '\t' + operation.title + operationPrefix
    const operationProperties = operation.properties
    Object.entries(operationProperties).forEach(
      ([key, operationParams]: [string, OperationParams]) => {
        opStrRepresentation += this.getTypeOperationParamContent(operationParams)
      }
    )

    opStrRepresentation += operationSuffix
    return opStrRepresentation
  }

  private getTypeOperationParamContent(operationParams: OperationParams): string {
    let operationParamStr = '\t' + operationParams.title + gqlMethodSignature + operationSuffix
    return operationParamStr
  }

  private getSchemaByFilePath(pathToType: string): string {
    const schemaValue = require(pathToType)
    return schemaValue.default
  }
}
