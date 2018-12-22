import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Service } from '../../../src/commands/service/service'
import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'

describe('test for service command', () => {
  let service: AbstractCommand
  const projectLegalFilesName = 'project-with-legal-files'
  const absPathToProjectWithLegalFile = path.join(
    __dirname,
    'projects-for-test',
    projectLegalFilesName
  )
  const pathToActualDirectory = path.join(__dirname, '../../output/actual')
  const pathToExpectedDirectory = path.join(__dirname, '../../output/expected/commands/service')
  const listAllDirectories = (rootDir: string) =>
    fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory())

  beforeAll(() => {
    service = new Service()
  })

  afterEach(() => {
    const dirsInActual = listAllDirectories(pathToActualDirectory)
    for (let dir of dirsInActual) {
      fse.remove(path.join(pathToActualDirectory, dir), err => {
        if (err) {
          console.log(
            'Could not remove cloned dir. On windows desktops, remove it manually...',
            err
          )
        }
      })
    }
    process.chdir(__dirname)
  })

  it('works if action returns a function', () => {
    const act = service.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('Should update files after service command action', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesName)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithLegalFile, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts')
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    const expectedContent = fs
      .readFileSync(pathToExpectedService)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToActualService)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).toEqual(expectedContent)
  })

  it('Should update files after service command action inner dir', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesName)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithLegalFile, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('/inner/dir/car.ts')
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/inner/dir/car.ts')
    const expectedContent = fs
      .readFileSync(pathToExpectedService)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToActualService)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).toEqual(expectedContent)
  })

  it('Should not override existing service file', async () => {
    const pathToExpectedExistingServiceDir = path.join(
      pathToExpectedDirectory,
      'project-with-existing-service'
    )
    process.chdir(pathToExpectedExistingServiceDir)
    const act = service.getAction()
    await act('car.ts')
    const pathToExistedService = path.join(pathToExpectedExistingServiceDir, 'src/services/car.ts')
    const pathToExpectedServiceIfOverride = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    const expectedContent = fs
      .readFileSync(pathToExistedService)
      .toString()
      .replace(/\s/g, '')
    const actualContent = fs
      .readFileSync(pathToExpectedServiceIfOverride)
      .toString()
      .replace(/\s/g, '')
    expect(actualContent).not.toEqual(expectedContent)
  })
})
