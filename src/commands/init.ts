import { AbstractCommand } from './abstract-command';
import * as inquirer from 'inquirer';
import { shell } from '../utils/shell'

const questions = [
  {
    type: 'rawlist',
    name: 'seedName',
    message: 'Select seed type',
    choices: ['graphql-server-typed', 'apollo-typed-lambda'],
  }
];

export class Init extends AbstractCommand{

  public getName(): string {
    return 'init <name>';
  }

  public getDescription(): string {
    return 'Create new project';
  }

  public getAction(): (...args: any[]) => void {
    return async (projectName: string) => {
      // const answers = inquirer.prompt(questions).then(answers => console.log('Got answers-', answers));
      const answer: any = await inquirer.prompt(questions);
      await shell(this.getCloneCommand(answer.seedName, projectName));
      console.log('Project cloned...');
    }
  }

  private getCloneCommand(seedName: string, projectName: string): string {
    const seedUrlToClone = this.getSeedUrlToClone(seedName)
    return `git clone ${seedUrlToClone} ${projectName}`;
  }

  private getSeedUrlToClone(seedName: string): string {
    return `https://github.com/tomyitav/${seedName}.git`;
  }

}
