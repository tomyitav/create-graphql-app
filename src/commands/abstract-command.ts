export interface CommandOptions {
  optionsPattern: string[]
  optionsDescription: string[]
}

export abstract class AbstractCommand {
  public abstract getName(): string
  public abstract getDescription(): string
  public abstract getAlias(): string
  public abstract getAction(): (...args: any[]) => void
  public getOptions(): CommandOptions {
    return {
      optionsPattern: [],
      optionsDescription: []
    }
  }
}
