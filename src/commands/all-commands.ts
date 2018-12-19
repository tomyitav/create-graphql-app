import { AbstractCommand } from './abstract-command'
import { Init } from './init'
import { Resolver } from './resolver/resolver'
import { Deploy } from './deploy'
import { Service } from './service'

const allCommands: AbstractCommand[] = [new Init(), new Resolver(), new Service(), new Deploy()]

export default allCommands
