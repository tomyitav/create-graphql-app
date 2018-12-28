import { AbstractCommand, CommandOptions } from '../abstract-command'
import { fileExists, locateFile, readFileContent, writeToFile } from '../../utils/file-operations'
import {
  contextInterfacePattern,
  contextInterfaceSignatureFn,
  contextInterfaceStartSeparators,
  contextPattern,
  contextSignatureFn,
  contextStartSeparators,
  importServicePrefix,
  injectorPattern,
  injectorSignatureFn,
  injectorStartSeparators,
  serviceFileNameSuffix,
  serviceFilePrefix,
  serviceFileSuffix,
  servicePattern
} from './service-files-constants'
import * as path from 'path'
import { startCase, get } from 'lodash'
import logger from '../../utils/logger'
import { Declaration, File, TypescriptParser } from 'typescript-parser'

type DefinitionFileType = 'injector' | 'context' | 'context-interface'
interface DefinitionFileProps {
  filePattern: object
  declarationName: string
  possibleStartSeparators: string[]
  definitionSignatureFn: (serviceName: string) => string
}

interface DeclarationInfo {
  content: string
  start: number
  end: number
}

const fileDefinitionMap: Map<DefinitionFileType, DefinitionFileProps> = new Map<
  DefinitionFileType,
  DefinitionFileProps
>([
  [
    'injector',
    {
      filePattern: injectorPattern,
      declarationName: 'injector',
      possibleStartSeparators: injectorStartSeparators,
      definitionSignatureFn: injectorSignatureFn
    }
  ],
  [
    'context',
    {
      filePattern: contextPattern,
      declarationName: 'getContext',
      possibleStartSeparators: contextStartSeparators,
      definitionSignatureFn: contextSignatureFn
    }
  ],
  [
    'context-interface',
    {
      filePattern: contextInterfacePattern,
      declarationName: 'IAppContext',
      possibleStartSeparators: contextInterfaceStartSeparators,
      definitionSignatureFn: contextInterfaceSignatureFn
    }
  ]
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
    await this.writeServiceFile(servicePath)
    logger.info('Service generation command was completed')
  }

  private async writeServiceFile(servicePath: string) {
    try {
      const pathToServicesDir = await locateFile(servicePattern, './', 'dir')
      if (!pathToServicesDir || !pathToServicesDir.length || !(pathToServicesDir.length === 1)) {
        logger.warn(
          'services directory should appear exactly once in the project- exitting service generation...'
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
          logger.info('Editing service definition files...')
          const serviceDefinitionPromises = Array.from(fileDefinitionMap.keys()).map(def =>
            this.modifyServiceDefinitionFile(joinedPathToService, serviceName, def)
          )
          await Promise.all(serviceDefinitionPromises)
          logger.info('Definition files were successfully updated!')
        }
      }
    } catch (err) {
      logger.error(`Got error in generating service- ${err}`)
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
  ): Promise<void> {
    logger.info('Modifying definitions in ' + definitionFileType + ' file...')
    const filePatternToLocate = (fileDefinitionMap.get(definitionFileType) as DefinitionFileProps)
      .filePattern
    const pathToDefFile = await locateFile(filePatternToLocate, './', 'file')
    if (!pathToDefFile || pathToDefFile.length !== 1) {
      logger.warn('Definition file for ' + definitionFileType + ' not found')
    } else {
      const fileContent = await this.getModifiedFileContent(
        pathToService,
        serviceClassName,
        pathToDefFile[0],
        definitionFileType
      )
      return writeToFile(pathToDefFile[0], fileContent)
    }
  }

  private async getModifiedFileContent(
    pathToService: string,
    serviceClassName: string,
    defFilePath: string,
    definitionFileType: DefinitionFileType
  ): Promise<string> {
    const defFileContent = await readFileContent(defFilePath)
    const parsedFile: File = await this.parser.parseFile(defFilePath, './')
    const { content: importsContent, end: importEnd } = this.getImportDefinitions(
      pathToService,
      serviceClassName,
      parsedFile,
      defFileContent
    )
    const {
      content: defContent,
      start: defStart,
      end: defEnd
    } = this.getModifiedServiceDefinitions(
      serviceClassName,
      parsedFile,
      defFileContent,
      definitionFileType
    )
    return (
      importsContent +
      defFileContent.substring(importEnd, defStart) +
      defContent +
      defFileContent.substring(defEnd)
    )
  }

  private getImportDefinitions(
    pathToService: string,
    serviceClassName: string,
    parsedFile: File,
    defFileContent: string
  ): DeclarationInfo {
    const importsEndChar = Array.isArray(parsedFile.imports)
      ? parsedFile.imports[parsedFile.imports.length - 1].end || 0
      : 0
    const originalImports = defFileContent.substring(0, importsEndChar)
    return {
      content: originalImports + '\n' + this.getServiceImportLine(pathToService, serviceClassName),
      start: 0,
      end: importsEndChar
    }
  }

  private getServiceImportLine(pathToService: string, serviceClassName: string): string {
    return (
      'import { ' +
      serviceClassName +
      " } from '" +
      importServicePrefix +
      this.locationInsideServicesDir(pathToService) +
      '/' +
      serviceClassName +
      "'"
    )
  }

  private locationInsideServicesDir(pathToService: string) {
    return pathToService
      .split('.')[0]
      .split('services')[1]
      .replace('\\', '/')
  }

  private getModifiedServiceDefinitions(
    serviceClassName: string,
    parsedFile: File,
    defFileContent: string,
    definitionFileType: DefinitionFileType
  ): DeclarationInfo {
    const declarationsArray = parsedFile.declarations
    const { content: definitionToModify, start, end } = this.getDeclarationContentByDefType(
      declarationsArray,
      defFileContent,
      definitionFileType
    )
    return {
      content: this.addServiceToPreviousDefinition(
        serviceClassName,
        definitionToModify,
        definitionFileType
      ),
      start,
      end
    }
  }

  private getDeclarationContentByDefType(
    declarationsArray: Declaration[],
    defFileContent: string,
    definitionFileType: DefinitionFileType
  ): DeclarationInfo {
    const emptyDeclarationInfo: DeclarationInfo = {
      content: '',
      start: 0,
      end: 0
    }
    const nameToFilterBy = get(fileDefinitionMap.get(definitionFileType), 'declarationName')
    const filteredDeclaration: Declaration[] = declarationsArray.filter(
      declaration => declaration.name === nameToFilterBy && declaration.start
    )
    if (filteredDeclaration.length !== 1) {
      logger.warn(
        'Definition file ' +
          definitionFileType +
          ' should contain exactly one definition for ' +
          nameToFilterBy +
          ', file will not be changed...'
      )
      return emptyDeclarationInfo
    } else {
      const declarationToFind: Declaration = filteredDeclaration[0]
      if (!declarationToFind.start || !declarationToFind.end) {
        logger.warn('Could not find start and end for declaration ' + declarationToFind.name)
        return emptyDeclarationInfo
      } else {
        return {
          content: defFileContent.substring(declarationToFind.start, declarationToFind.end),
          start: declarationToFind.start,
          end: declarationToFind.end
        }
      }
    }
  }

  private addServiceToPreviousDefinition(
    serviceClassName: string,
    definitionToModify: string,
    definitionFileType: DefinitionFileType
  ): string {
    const definitionFileProps = fileDefinitionMap.get(definitionFileType) as DefinitionFileProps
    const possibleStartSeparators: string[] = definitionFileProps.possibleStartSeparators
    const serviceSignatureFn = definitionFileProps.definitionSignatureFn
    for (let separator of possibleStartSeparators) {
      const indexOfSeparator = definitionToModify.lastIndexOf(separator)
      if (indexOfSeparator !== -1) {
        return (
          definitionToModify.substring(0, indexOfSeparator + separator.length) +
          '\n' +
          serviceSignatureFn(serviceClassName) +
          definitionToModify.substring(indexOfSeparator + separator.length)
        )
      }
    }
    return definitionToModify
  }
}
