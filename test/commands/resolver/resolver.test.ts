import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Resolver } from '../../../src/commands/resolver/resolver'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'

describe('Resolver command test', () => {
  let res: AbstractCommand
  const pathToType1 = path.join(__dirname, 'legal-schemas/test-schema1.ts')
  const pathToTypeTweets = path.join(__dirname, 'legal-schemas/tweet-test-schema.ts')
  const pathToIllegalSchema1 = path.join(__dirname, 'illegal-schemas/illegal-schema1.ts')
  const pathToActualResolver1 = path.join(__dirname, '../../output/actual/test-resolver.ts')
  const pathToActualResolverTweets = path.join(
    __dirname,
    '../../output/actual/tweets-test-resolver.ts'
  )
  const pathToDirectoryActualResolver = path.join(
    __dirname,
    '../../output/actual/non/existing/dir/test-resolver.ts'
  )
  const resolverDirLocation = path.join(__dirname, '../../output/actual/non')
  const pathToExpectedResolver1 = path.join(
    __dirname,
    '../../output/expected/commands/resolver/test-resolver.ts'
  )
  const pathToExpectedResolverTweets = path.join(
    __dirname,
    '../../output/expected/commands/resolver/tweets-test-resolver.ts'
  )
  const pathToNonOverridenFile = path.join(
    __dirname,
    '../../output/expected/commands/resolver/test-not-overriden-by-resolver.ts'
  )

  beforeAll(() => {
    process.chdir(__dirname)
    res = new Resolver()
  })

  afterEach(() => {
    if (fs.existsSync(pathToActualResolver1)) {
      fs.unlinkSync(pathToActualResolver1)
    }
    if (fs.existsSync(pathToActualResolverTweets)) {
      fs.unlinkSync(pathToActualResolverTweets)
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

  it('works if resolver file was not generated for illegal schema 1', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToIllegalSchema1, pathToActualResolver1)
    const resolverFileExist: boolean = fs.existsSync(pathToActualResolver1)
    expect(resolverFileExist).not.toBeTruthy()
  })

  it('works if resolver file was generated for test-schema-1', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType1, pathToActualResolver1)
    const resolverFileExist: boolean = fs.existsSync(pathToActualResolver1)
    expect(resolverFileExist).toBeTruthy()
  })

  it('works if resolver file was generated for tweet-test-schema', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToTypeTweets, pathToActualResolverTweets)
    const resolverFileExist: boolean = fs.existsSync(pathToActualResolverTweets)
    expect(resolverFileExist).toBeTruthy()
  })

  it('works if resolver file was generated in directory structure', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType1, pathToDirectoryActualResolver)
    const resolverFileExist: boolean = fs.existsSync(pathToDirectoryActualResolver)
    expect(resolverFileExist).toBeTruthy()
  })

  it('works if resolver file is identical to expected file for test-schema1', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType1, pathToActualResolver1)
    const expectedContent = fs
      .readFileSync(pathToExpectedResolver1)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToActualResolver1)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).toEqual(expectedContent)
  })

  it('works if resolver file is identical to expected file for tweets-test-schema', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToTypeTweets, pathToActualResolverTweets)
    const expectedContent = fs
      .readFileSync(pathToExpectedResolverTweets)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToActualResolverTweets)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).toEqual(expectedContent)
  })

  it('works if resolver command does not override existing file', async () => {
    const actFunction = res.getAction()
    await actFunction(pathToType1, pathToNonOverridenFile)
    const expectedContent = fs
      .readFileSync(pathToExpectedResolver1)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToNonOverridenFile)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).not.toEqual(expectedContent)
  })
})
