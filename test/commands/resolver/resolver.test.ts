/**
 * Dummy test
 */
import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as path from 'path'
import * as fs from 'fs'

describe('Resolver command test', () => {
  let res: AbstractCommand
  const pathToType = path.join(__dirname, './test-schema.ts')
  const pathToActualResolver = path.join(__dirname, '../../output/actual/test-resolver.ts')
  const pathToExpectedResolver = path.join(__dirname, '../../output/expected/test-resolver.ts')
  const pathToNonOverridenFile = path.join(
    __dirname,
    '../../output/expected/test-not-overriden-by-resolver.ts'
  )
  beforeAll(() => {
    res = new Resolver()
  })

  afterEach(() => {
    if (fs.existsSync(pathToActualResolver)) {
      fs.unlinkSync(pathToActualResolver)
    }
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

  it('works if resolver file is identical to expected file', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType, pathToActualResolver)
    const expectedContent = fs
      .readFileSync(pathToExpectedResolver)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToActualResolver)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).toEqual(expectedContent)
  })

  it('works if resolver command does not override existing file', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType, pathToNonOverridenFile)
    const expectedContent = fs
      .readFileSync(pathToExpectedResolver)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToNonOverridenFile)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).not.toEqual(expectedContent)
  })
})
