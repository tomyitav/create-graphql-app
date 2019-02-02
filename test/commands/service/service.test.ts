import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Service } from '../../../src/commands/service/service'
import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import { compareTestFilesByPaths } from '../../test-helpers'
import { ActionCmd } from '../../../src/commands/ActionCmd'

describe('test for service command', () => {
  let service: AbstractCommand
  const projectLegalFilesName = 'project-with-legal-files'
  const projectLegalFilesAlternatePrefix = 'project-with-legal-files-alternative-prefix'
  const projectLegalFilesNameIgnoreContext = 'project-with-legal-files-ignore-context'
  const projectOneMissingFile = 'project-with-one-missing-file'
  const projectMissingServicesDir = 'project-with-no-services-dir'
  const projectLegalFilesNameInner = 'project-with-legal-files-inner-dir'
  const projectLegalFilesNameInnerDash = 'project-with-legal-files-inner-dash-dir'
  const project2InnerDirs = 'project-with-2-inner-dirs'
  const cmdForCommandUndefined: ActionCmd = {
    parent: {
      ignoreContext: undefined
    }
  }
  const cmdForCommandTrue: ActionCmd = {
    parent: {
      ignoreContext: true
    }
  }
  const absPathToProjectWithLegalFile = path.join(
    __dirname,
    'projects-for-test',
    projectLegalFilesName
  )
  const absPathToProjectWithAlternatePrfix = path.join(
    __dirname,
    'projects-for-test',
    projectLegalFilesAlternatePrefix
  )
  const absPathToProjectWithOneMissing = path.join(
    __dirname,
    'projects-for-test',
    projectOneMissingFile
  )
  const absPathToProjectWithNoServices = path.join(
    __dirname,
    'projects-for-test',
    projectMissingServicesDir
  )
  const absPathToProject2InnerDirs = path.join(__dirname, 'projects-for-test', project2InnerDirs)
  const pathToActualDirectory = path.join(__dirname, '../../output/actual')
  const pathToExpectedDirectory = path.join(__dirname, '../../output/expected/commands/service')
  const listAllDirectories = (rootDir: string) =>
    fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory())

  beforeAll(() => {
    process.chdir(__dirname)
    service = new Service()
  })

  // afterEach(() => {
  //   const dirsInActual = listAllDirectories(pathToActualDirectory)
  //   for (let dir of dirsInActual) {
  //     fse.remove(path.join(pathToActualDirectory, dir), err => {
  //       if (err) {
  //         console.log(
  //           'Could not remove cloned dir. On windows desktops, remove it manually...',
  //           err
  //         )
  //       }
  //     })
  //   }
  //   process.chdir(__dirname)
  // })

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
    await act('car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should update files after service command alternate prefix', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesAlternatePrefix)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithAlternatePrfix, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should update files after service command action but not context when ignored', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesNameIgnoreContext)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithLegalFile, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts', cmdForCommandTrue)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameIgnoreContext,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameIgnoreContext,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameIgnoreContext,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameIgnoreContext,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should update files after service command action with inner dir', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, project2InnerDirs)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProject2InnerDirs, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      project2InnerDirs,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      project2InnerDirs,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      project2InnerDirs,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      project2InnerDirs,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should not update def files after service command when no services dir', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectMissingServicesDir)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithNoServices, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts', cmdForCommandUndefined)
    const pathToServiceFileIfHadBeenCreated = path.join(actualDirToCreate, 'car.ts')
    const serviceFileExists: boolean = fs.existsSync(pathToServiceFileIfHadBeenCreated)
    expect(serviceFileExists).not.toBeTruthy()

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectMissingServicesDir,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector, false)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectMissingServicesDir,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext, false)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectMissingServicesDir,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface, false)
  })

  it('Should update files after service command action when one def file missing', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectOneMissingFile)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithOneMissing, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectOneMissingFile,
      'src/services/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectOneMissingFile,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectOneMissingFile,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)
  })

  it('Should update files after service command action inner dir', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesNameInner)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithLegalFile, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('/inner/dir/car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInner,
      'src/services/inner/dir/car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/inner/dir/car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInner,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInner,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInner,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should update files after service command action inner dir in dash format', async () => {
    const actualDirToCreate = path.join(pathToActualDirectory, projectLegalFilesNameInnerDash)
    fse.mkdirsSync(actualDirToCreate)
    fse.copySync(absPathToProjectWithLegalFile, actualDirToCreate)
    process.chdir(actualDirToCreate)
    const act = service.getAction()
    await act('/inner/dir/dash-car.ts', cmdForCommandUndefined)
    const pathToExpectedService = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInnerDash,
      'src/services/inner/dir/dash-car.ts'
    )
    const pathToActualService = path.join(actualDirToCreate, 'src/services/inner/dir/dash-car.ts')
    compareTestFilesByPaths(pathToActualService, pathToExpectedService)

    const pathToExpectedInjector = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInnerDash,
      'src/core/injector.ts'
    )
    const pathToActualInjector = path.join(actualDirToCreate, 'src/core/injector.ts')
    compareTestFilesByPaths(pathToActualInjector, pathToExpectedInjector)

    const pathToExpectedContext = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInnerDash,
      'src/context.ts'
    )
    const pathToActualContext = path.join(actualDirToCreate, 'src/context.ts')
    compareTestFilesByPaths(pathToActualContext, pathToExpectedContext)

    const pathToExpectedContextInterface = path.join(
      pathToExpectedDirectory,
      projectLegalFilesNameInnerDash,
      'src/interfaces/IAppContext.ts'
    )
    const pathToActualContextInterface = path.join(
      actualDirToCreate,
      'src/interfaces/IAppContext.ts'
    )
    compareTestFilesByPaths(pathToActualContextInterface, pathToExpectedContextInterface)
  })

  it('Should not override existing service file', async () => {
    const pathToExistingServiceDir = path.join(
      pathToExpectedDirectory,
      'project-with-existing-service'
    )
    process.chdir(pathToExistingServiceDir)
    const act = service.getAction()
    await act('car.ts', cmdForCommandUndefined)
    const pathToExistedService = path.join(pathToExistingServiceDir, 'src/services/car.ts')
    const pathToExpectedServiceIfOverride = path.join(
      pathToExpectedDirectory,
      projectLegalFilesName,
      'src/services/car.ts'
    )
    compareTestFilesByPaths(pathToExistedService, pathToExpectedServiceIfOverride, false)
  })
})
