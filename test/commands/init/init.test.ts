import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Init } from '../../../src/commands/init'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import * as fse from 'fs-extra'
import * as path from 'path'

jest.mock('inquirer')
const mockedInquirer = inquirer as jest.Mocked<typeof inquirer>

describe('Init command test', () => {
  let init: AbstractCommand
  const pathToProjectDir = './test/output/actual/test-project-name'
  const absoluteProcessDir = path.join(process.cwd(), pathToProjectDir)

  beforeAll(() => {
    init = new Init()
  })

  afterEach(() => {
    if (fs.existsSync(absoluteProcessDir)) {
      fse.remove(absoluteProcessDir, err => {
        console.log('Could not remove cloned dir. On windows desktops, remove it manually...', err)
      })
    }
  })

  it('works if action returns a function', () => {
    const act = init.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('works if directory is cloned after applying init', async () => {
    jest.setTimeout(180000)
    mockedInquirer.prompt.mockReturnValue({ seedName: 'graphql-server-typed' })
    const actFunction = init.getAction()
    await actFunction(pathToProjectDir)
    const projectFolderExists: boolean = fs.lstatSync(absoluteProcessDir).isDirectory()
    const projectNodeModulesExists: boolean = fs
      .lstatSync(path.join(absoluteProcessDir, 'node_modules'))
      .isDirectory()
    expect(projectFolderExists).toBeTruthy()
    expect(projectNodeModulesExists).toBeTruthy()
  })
})
