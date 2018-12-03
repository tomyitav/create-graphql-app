#!/usr/bin/env node

import * as program from 'commander'
import allCommands from './commands/all-commands'

require('pkginfo')(module, 'version')

program.version(module.exports.version).description('Cli tool for bootstrapping production grade GraphQL server')

for (let command of allCommands) {
  program
    .command(command.getName())
    .description(command.getDescription())
    .alias(command.getAlias())
    .action(command.getAction())
}

program.parse(process.argv)
