import { AbstractCommand } from '../abstract-command'
import * as transform_ from 'graphql-json-schema'
const transform = transform_
import { Operation, Schema } from './resolver-types'
import {
  functionOperationPrefix,
  gqlMethodSignature,
  gqlMethodSuffix,
  keysToGenerate,
  operationFuntionsSuffix,
  operationPrefix,
  operationSuffix,
  resolverPrefix,
  resolverSuffix,
  subscriptionSubscribeDefinition
} from './resolver-constants'
import { fileExists, readFileContent, writeToFile } from '../../utils/file-operations'
import logger from '../../utils/logger'

export class Resolver extends AbstractCommand {
  public getName(): string {
    return 'resolver <path-to-type> <path-to-resolver>'
  }

  public getAction(): (...args: any[]) => void {
    return async (pathToType: string, pathToResolver: string) => {
      try {
        const resolverExists = await fileExists(pathToResolver)
        if (resolverExists) {
          logger.warn(
            'Resolver file already exists. please select a different path or remove the current file...'
          )
          return
        }
        const schema = await this.getSchemaByFilePath(pathToType)
        if (!schema || schema === '') {
          logger.error('Failed to read schema, exiting...')
          return
        }
        const schemaJsonRepresentation = transform(schema)
        const resolverContent = this.resolverContentByJsonSchema(schemaJsonRepresentation)
        logger.info('Writing resolvers to ' + pathToResolver + '...')
        await writeToFile(pathToResolver, resolverContent)
        logger.info('Resolver file was created successfully!')
      } catch (err) {
        logger.error(`Error in generating resolver- ${err}`)
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

  private async getSchemaByFilePath(pathToType: string): Promise<string> {
    try {
      const typeFileContent = await readFileContent(pathToType)
      const splittedBySchema = typeFileContent.split('`')
      if (splittedBySchema.length !== 3) {
        return ''
      }
      return splittedBySchema[1]
    } catch (err) {
      logger.error(`Got error in reading type file- ${err}`)
      return ''
    }
  }
}
