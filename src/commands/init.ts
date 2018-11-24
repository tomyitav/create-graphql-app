import { AbstractCommand } from './abstract-command'
import * as inquirer from 'inquirer'
import { shell } from '../utils/shell'

const questions = [
  {
    type: 'rawlist',
    name: 'seedName',
    message: 'Select seed type',
    choices: ['graphql-server-typed', 'apollo-typed-lambda']
  }
]

export class Init extends AbstractCommand {
  public getName(): string {
    return 'init <name>'
  }

  public getDescription(): string {
    return 'Create new project'
  }

  public getAction(): (...args: any[]) => void {
    return async (projectName: string) => {
      try {
        const answer: any = await inquirer.prompt(questions)
        await shell(this.getCloneCommand(answer.seedName, projectName))
        console.log('Project cloned, installing dependencies...')
        process.chdir(projectName)
        await shell(this.getInstallCommand())
        console.log('Dependencies installed successfully')
      } catch (err) {
        console.error('Got error in init command- ', err)
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
