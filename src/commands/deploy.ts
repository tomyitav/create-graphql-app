import { AbstractCommand } from './abstract-command'
import { shell } from '../utils/shell'
import { fileExists } from '../utils/file-operations'
import * as path from 'path'
import logger from '../utils/logger'

export class Deploy extends AbstractCommand {
  public getName(): string {
    return 'deploy [project-path]'
  }

  public getDescription(): string {
    return 'Deploy project to production'
  }

  public getAlias(): string {
    return 'd'
  }

  public getAction(): (...args: any[]) => void {
    return async (projectPath: string) => {
      try {
        const pathToAppend = projectPath ? projectPath : ''
        const pkgJsonFile = path.join(pathToAppend, 'package.json')
        const pkgJsonFileExist = await fileExists(pkgJsonFile)
        if (!pkgJsonFileExist) {
          logger.error('No package.json file found, exiting...')
          return
        }
        logger.info('Deploying server to production...')
        if (pathToAppend !== '') {
          process.chdir(pathToAppend)
        }
        await shell(this.getDeployCommand())
        logger.info('Project successfully deployed!')
      } catch (err) {
        logger.error(`Got error in deploy command- ${err}`)
      }
    }
  }

  private getDeployCommand(): string {
    return `npm run deploy`
  }
}
