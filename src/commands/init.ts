import { AbstractCommand } from './abstract-command'
import * as inquirer from 'inquirer'
import { shell } from '../utils/shell'
import logger from '../utils/logger'

const questions = [
  {
    type: 'rawlist',
    name: 'seedName',
    message: 'Select seed type',
    choices: [
      {
        name: 'graphql-server-typed: Typescript server deployed on now',
        value: 'graphql-server-typed'
      },
      {
        name: 'apollo-typed-lambda: Typescript server for aws lambda deployment',
        value: 'apollo-typed-lambda'
      }
    ]
  }
]

export class Init extends AbstractCommand {
  public getName(): string {
    return 'init <name>'
  }

  public getDescription(): string {
    return 'Create new project'
  }

  public getAlias(): string {
    return 'i'
  }

  public getAction(): (...args: any[]) => void {
    return async (projectName: string) => {
      try {
        const answer: any = await inquirer.prompt(questions)
        await shell(this.getCloneCommand(answer.seedName, projectName))
        logger.info('Project cloned, installing dependencies...')
        process.chdir(projectName)
        await shell(this.getInstallCommand())
        logger.info('Dependencies installed successfully')
      } catch (err) {
        logger.error(`Got error in init command- ${err}`)
      }
    }
  }

  private getCloneCommand(seedName: string, projectName: string): string {
    const seedUrlToClone = this.getSeedUrlToClone(seedName)
    return `git clone ${seedUrlToClone} ${projectName}`
  }

  private getSeedUrlToClone(seedName: string): string {
    return `https://github.com/tomyitav/${seedName}.git`
  }

  private getInstallCommand(): string {
    return `npm install`
  }
}
