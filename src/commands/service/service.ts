import { AbstractCommand, CommandOptions } from '../abstract-command'
import { fileExists, locateFile, writeToFile } from '../../utils/file-operations'
import {
  serviceFileNameSuffix,
  serviceFilePrefix,
  serviceFileSuffix,
  servicePattern
} from './service-files-constants'
import * as path from 'path'
import { startCase } from 'lodash'
import logger from '../../utils/logger'

export class Service extends AbstractCommand {
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
      const pathToServicesDir = await locateFile(servicePattern, './', 'dir')
      if (pathToServicesDir.length === 0) {
        logger.warn(
          'services directory was not found. please make sure you are in project root directory, and that services directory exists'
        )
        return
      } else if (pathToServicesDir.length > 1) {
        logger.warn(
          'Found two services directories: ' +
            pathToServicesDir.toString() +
            '. Please make sure only one services directory exists.'
        )
        return
      } else {
        const joinedPathToService = path.join(pathToServicesDir[0], servicePath)
        const serviceFileExists = await fileExists(joinedPathToService)
        if (serviceFileExists) {
          logger.warn('Service file already exists. Please select a different location')
        } else {
          logger.info('Generating service file...')
          await writeToFile(joinedPathToService, this.getServiceFileContent(servicePath))
          logger.info('Service file was added to- ' + joinedPathToService)
        }
      }
    } catch (err) {
      logger.error(`Failed to generate service- ${err}`)
    }
  }

  private getServiceFileContent(servicePath: string) {
    const serviceClassName = this.getServiceClassName(servicePath)
    return serviceFilePrefix + serviceClassName + serviceFileSuffix
  }

  private getServiceClassName(servicePath: string) {
    return startCase(path.parse(servicePath).base.split('.')[0]) + serviceFileNameSuffix
  }
}
