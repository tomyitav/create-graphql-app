import { AbstractCommand } from './abstract-command'
import { shell } from '../utils/shell'
import { fileExists } from '../utils/file-operations'
import * as path from 'path'

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
        const pkgJsonFileExist = await fileExists(path.join(pathToAppend, 'package.json'))
        if (!pkgJsonFileExist) {
          console.error('No package.json file found, exiting...')
        }
        console.log('Deploying project to production...')
        if (pathToAppend !== '') {
          process.chdir(pathToAppend)
        }
        await shell(this.getDeployCommand())
        console.log('Project successfully deployed!')
      } catch (err) {
        console.error('Got error in deploy command- ', err)
      }
    }
  }

  private getDeployCommand(): string {
    return `npm run deploy`
  }
}
