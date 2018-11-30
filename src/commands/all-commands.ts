import { AbstractCommand } from './abstract-command'
import { Init } from './init'
import { Resolver } from './resolver/resolver'

const allCommands: AbstractCommand[] = [new Init(), new Resolver()]

export default allCommands
