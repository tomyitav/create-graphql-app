import { AbstractCommand, CommandOptions } from './abstract-command'

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

  public getAction(): (...args: any[]) => void {
    return async (servicePath: string) => {
      return
    }
  }

  public getOptions(): CommandOptions {
    return {
      optionsPattern: ['--no-context'],
      optionsDescription: ['Do not add service to server gql context']
    }
  }
}
