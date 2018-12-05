import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as fs from 'fs'
import * as fse from 'fs-extra'

//TODO - remove only
describe.only('Resolver command test', () => {
  let res: AbstractCommand
  const pathToType = './test/commands/resolver/test-schema.ts'
  const pathToActualResolver = './test/output/actual/test-resolver.ts'
  const pathToDirectoryActualResolver = './test/output/actual/non/existing/dir/test-resolver.ts'
  const resolverDirLocation = './test/output/actual/non'
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
    fs.stat(resolverDirLocation, (err, stats) => {
      if (!err) {
        if (stats.isDirectory()) {
          fse.remove(resolverDirLocation, err => {
            console.log(
              'Could not remove resolver dir. On windows desktops, remove it manually...',
              err
            )
          })
        }
      }
    })
  })

  it('works if action returns a function', () => {
    const act = res.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it.only('works if resolver file was generated', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType, pathToActualResolver)
    const resolverFileExist: boolean = fs.existsSync(pathToActualResolver)
    expect(resolverFileExist).toBeTruthy()
  })

  it('works if resolver file was generated in directory structure', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType, pathToDirectoryActualResolver)
    const resolverFileExist: boolean = fs.existsSync(pathToDirectoryActualResolver)
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

  // it('works if resolver file is in dir and identical to expected', async () => {
  //   const actFunction = res.getAction()
  //   await actFunction(pathToType, pathToDirectoryActualResolver)
  //   const expectedContent = fs
  //     .readFileSync(pathToExpectedResolver)
  //     .toString()
  //     .replace(/\s/g, '')
  //   const actualContent = fs
  //     .readFileSync(pathToDirectoryActualResolver)
  //     .toString()
  //     .replace(/\s/g, '')
  //   expect(actualContent).toEqual(expectedContent)
  // })

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
