import allCommands from '../../src/commands/all-commands'

describe('test all commands file', () => {
  it.only('works if allCommands is a valid command array', () => {
    expect(allCommands.length > 0).toBeTruthy()
    for (let command of allCommands) {
      expect(command.getAlias().length > 0).toBeTruthy()
      expect(command.getDescription().length > 0).toBeTruthy()
      expect(command.getName().length > 0).toBeTruthy()
      expect(command.getAction()).toBeInstanceOf(Function)
      expect(command.getOptions().optionsPattern.length).toBe(
        command.getOptions().optionsDescription.length
      )
    }
  })
})
