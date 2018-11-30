/**
 * Dummy test
 */
import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as path from 'path'
import * as fs from 'fs'

describe('Resolver command test', () => {
  let res: AbstractCommand
  const pathToActualResolver = path.join(__dirname, '../../output/actual/test-resolver.ts')
  const pathToType = path.join(__dirname, './test-schema.ts')
  beforeAll(() => {
    res = new Resolver()
  })

  afterEach(() => {
    fs.unlinkSync(pathToActualResolver)
  })

  it('works if action returns a function', () => {
    const act = res.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('works if resolver file was generated', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType, pathToActualResolver)
    const resolverFileExist: boolean = fs.existsSync(pathToActualResolver)
    expect(resolverFileExist).toBeTruthy()
  })
})
