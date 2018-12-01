import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as fs from 'fs'

describe('Resolver command test', () => {
  // const mockedProcess = process as jest.Mocked<typeof process>
  let res: AbstractCommand
  const pathToType = './test/commands/resolver/test-schema.ts'
  const pathToActualResolver = './test/output/actual/test-resolver.ts'
  const pathToExpectedResolver = './test/output/expected/commands/resolver/test-resolver.ts'
  const pathToNonOverridenFile =
    './test/output/expected/commands/resolver/test-not-overriden-by-resolver.ts'

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
