import { AbstractCommand } from '../abstract-command'
import * as transform_ from 'graphql-json-schema'
const transform = transform_
import { Operation, Schema } from './resolver-types'
import {
  functionOperationPrefix,
  gqlMethodSuffix,
  gqlMethodSignature,
  keysToGenerate,
  operationPrefix,
  operationSuffix,
  resolverPrefix,
  resolverSuffix,
  subscriptionSubscribeDefinition,
  operationFuntionsSuffix
} from './resolver-constants'
import { fileExist, writeToFile } from '../../utils/file-operations'

export class Resolver extends AbstractCommand {
  public getName(): string {
    return 'resolver <path-to-type> <path-to-resolver>'
  }

  public getAction(): (...args: any[]) => void {
    return async (pathToType: string, pathToResolver: string) => {
      try {
        const resolverExists = await fileExist(pathToResolver)
        if (resolverExists) {
          console.log(
            'Resolver file already exists. please select a different path or remove the current file...'
          )
          return
        }
        const schema = this.getSchemaByFilePath(pathToType)
        const schemaJsonRepresentation = transform(schema)
        const resolverContent = this.resolverContentByJsonSchema(schemaJsonRepresentation)
        console.log('Writing resolvers to ' + pathToResolver + '...')
        await writeToFile(pathToResolver, resolverContent)
        console.log('Resolver file was created successfully!')
      } catch (err) {
        console.error('Error in generating resolver- ', err)
      }
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
        resolverContent += this.getTypeOperationContent(operation) + operationSuffix
      }
    })
    resolverContent += resolverSuffix
    return resolverContent
  }

  private getTypeOperationContent(operation: Operation): string {
    let opStrRepresentation = '\t' + operation.title + operationPrefix
    const operationProperties = operation.properties
    Object.keys(operationProperties).forEach((key: string) => {
      opStrRepresentation += this.getTypeOperationParamContent(key, operation)
    })

    opStrRepresentation += operationFuntionsSuffix
    return opStrRepresentation
  }

  private getTypeOperationParamContent(key: string, operation: Operation): string {
    let operationParamStr = '\t\t' + key
    if (operation.title === 'Subscription') {
      operationParamStr +=
        operationPrefix +
        subscriptionSubscribeDefinition +
        gqlMethodSignature +
        functionOperationPrefix +
        '\t' +
        operationFuntionsSuffix
    } else {
      operationParamStr += gqlMethodSignature + gqlMethodSuffix
    }
    return operationParamStr
  }

  private getSchemaByFilePath(pathToType: string): string {
    const schemaValue = require(pathToType)
    return schemaValue.default
  }
}
