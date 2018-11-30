import { AbstractCommand } from '../abstract-command'
import * as transform from 'graphql-json-schema'
import { Schema } from './resolver-types'

const resolverPrefix = 'const resolveFunctions = {'
const resolverSuffix = '};'

export class Resolver extends AbstractCommand {
  public getName(): string {
    return 'resolver <path-to-type>'
  }

  public getAction(): (...args: any[]) => void {
    return async (pathToType: string) => {
      const schema = this.getSchemaByFilePath(pathToType)
      const schemaJsonRepresentation = transform(schema)
      return schemaJsonRepresentation
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
    return ''
  }

  private getSchemaByFilePath(pathToType: string): string {
    const schemaValue = require(pathToType)
    return schemaValue.default
  }
}
