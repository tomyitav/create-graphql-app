import { AbstractCommand } from './abstract-command'
import { Init } from './init'

const allCommands: AbstractCommand[] = [
  new Init()
]

export default allCommands;
