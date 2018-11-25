#!/usr/bin/env node

import * as program from 'commander'
import allCommands from './commands/all-commands'

program.version('1.2.2').description('Cli tool for bootstrapping production grade GraphQL server')

for (let command of allCommands) {
  program
    .command(command.getName())
    .description(command.getDescription())
    .action(command.getAction())
}

program.parse(process.argv)
