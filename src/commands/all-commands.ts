import { AbstractCommand } from './abstract-command'
import { Init } from './init'
import { Resolver } from './resolver/resolver'
import { Deploy } from './deploy'

const allCommands: AbstractCommand[] = [new Init(), new Resolver(), new Deploy()]

export default allCommands
