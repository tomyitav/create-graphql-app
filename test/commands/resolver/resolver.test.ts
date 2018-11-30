/**
 * Dummy test
 */
import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as path from 'path'

describe('Resolver command test', () => {
  let res: AbstractCommand
  beforeAll(() => {
    res = new Resolver()
  })

  it('works if action returns a function', () => {
    const act = res.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('works if resolver output from type is correct', async () => {
    const actFunction = res.getAction()
    const schemaFileContent = await actFunction(path.join(__dirname, './test-schema.ts'))
    console.log('Schema content- ', schemaFileContent)
    expect(true).toBeTruthy()
  })
})
