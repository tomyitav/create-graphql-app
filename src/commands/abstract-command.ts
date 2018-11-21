export abstract class AbstractCommand {
  public abstract getName(): string;
  public abstract getDescription(): string;
  public abstract getAction(): (...args: any[]) => void;
}
