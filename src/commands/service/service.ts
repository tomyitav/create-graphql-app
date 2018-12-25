import { AbstractCommand, CommandOptions } from '../abstract-command'
import { fileExists, locateFile, readFileContent, writeToFile } from '../../utils/file-operations'
import {
  contextPattern,
  injectorPattern,
  serviceFileNameSuffix,
  serviceFilePrefix,
  serviceFileSuffix,
  servicePattern
} from './service-files-constants'
import * as path from 'path'
import { startCase, get } from 'lodash'
import logger from '../../utils/logger'
import { File, TypescriptParser } from 'typescript-parser'

type DefinitionFileType = 'injector' | 'context'
interface DefinitionFileProps {
  filePattern: object
  declarationName: string
}

const fileDefinitionMap: Map<DefinitionFileType, DefinitionFileProps> = new Map<
  DefinitionFileType,
  DefinitionFileProps
>([
  ['injector', { filePattern: injectorPattern, declarationName: 'injector' }],
  ['context', { filePattern: contextPattern, declarationName: 'getContext' }]
])

export class Service extends AbstractCommand {
  private parser: TypescriptParser
  constructor() {
    super()
    this.parser = new TypescriptParser()
  }

  public getName(): string {
    return 'service [service-path]'
  }

  public getDescription(): string {
    return 'Add new service to services dir, and to server gql context'
  }

  public getAlias(): string {
    return 's'
  }

  public getOptions(): CommandOptions {
    return {
      optionsPattern: ['--no-context'],
      optionsDescription: ['Do not add service to server gql context']
    }
  }

  public getAction(): (...args: any[]) => void {
    return async (servicePath: string) => {
      return this.createServiceFile(servicePath)
    }
  }

  private async createServiceFile(servicePath: string) {
    try {
      await this.writeServiceFile(servicePath)
    } catch (err) {
      logger.error(`Failed to generate service- ${err}`)
    }
  }

  private async writeServiceFile(servicePath: string) {
    const pathToServicesDir = await locateFile(servicePattern, './', 'dir')
    if (pathToServicesDir.length === 0) {
      logger.warn(
        'services directory was not found. please make sure you are in project root directory, and that services directory exists'
      )
    } else if (pathToServicesDir.length > 1) {
      logger.warn(
        'Found two services directories: ' +
          pathToServicesDir.toString() +
          '. Please make sure only one services directory exists.'
      )
    } else {
      const joinedPathToService = path.join(pathToServicesDir[0], servicePath)
      const serviceFileExists = await fileExists(joinedPathToService)
      if (serviceFileExists) {
        logger.warn('Service file already exists. Please select a different location')
      } else {
        logger.info('Generating service file...')
        const serviceName = this.getServiceClassName(servicePath)
        await writeToFile(joinedPathToService, this.getServiceFileContent(serviceName))
        logger.info('Service file was added to- ' + joinedPathToService)
      }
    }
  }

  private getServiceFileContent(serviceClassName: string) {
    return serviceFilePrefix + serviceClassName + serviceFileSuffix
  }

  private getServiceClassName(servicePath: string) {
    return startCase(path.parse(servicePath).base.split('.')[0]) + serviceFileNameSuffix
  }

  private async modifyServiceDefinitionFile(
    pathToService: string,
    serviceClassName: string,
    definitionFileType: DefinitionFileType
  ) {
    const filePatternToLocate = get(fileDefinitionMap.get(definitionFileType), 'filePattern')
    const pathToDefFile = await locateFile(filePatternToLocate, './', 'file')
    if (!pathToDefFile || pathToDefFile.length !== 1) {
      logger.warn('Definition file for ' + definitionFileType + ' not found')
    } else {
      this.getModifiedFileContent(pathToService, serviceClassName, pathToDefFile[0])
    }
  }

  private async getModifiedFileContent(
    pathToService: string,
    serviceClassName: string,
    defFilePath: string
  ) {
    const defFileContent = await readFileContent(pathToService)
    const parsedFile: File = await this.parser.parseFile(defFilePath, './')
    const importsDefinitions = this.getImportDefinitions(
      pathToService,
      serviceClassName,
      parsedFile,
      defFileContent
    )
  }

  private getImportDefinitions(
    pathToService: string,
    serviceClassName: string,
    parsedFile: File,
    defFileContent: string
  ): string {
    const importsEndChar = Array.isArray(parsedFile.imports)
      ? parsedFile.imports[parsedFile.imports.length - 1].end
      : 0
    const originalImports = defFileContent.substring(0, importsEndChar)
    return (
      originalImports + '\n' + this.getServiceImportLine(pathToService, serviceClassName) + '\n'
    )
  }

  private getServiceImportLine(pathToService: string, serviceClassName: string): string {
    return 'import { ' + serviceClassName + " } from './" + pathToService.split('.')[0] + "'"
  }
}
