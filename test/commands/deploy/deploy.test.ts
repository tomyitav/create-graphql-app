import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Deploy } from '../../../src/commands/deploy'
import * as path from 'path'

//TODO - remove only
describe.only('test for deploy command', () => {
  let deploy: AbstractCommand
  const pathToProjectDir = './test/commands/deploy/inner-dir'
  const pathToProjectNoPackage = './test/commands/deploy/inner-dir-no-package'
  const absoluteProcessDir = path.join(process.cwd(), pathToProjectDir)
  const absoluteProcessDirNoPackage = path.join(process.cwd(), pathToProjectNoPackage)

  beforeAll(() => {
    deploy = new Deploy()
  })

  it('works if action returns a function', () => {
    const act = deploy.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('works if deploy command is executed in directory', async () => {
    const act = deploy.getAction()
    const spy = jest.spyOn(deploy as any, 'getDeployCommand')
    await act(undefined)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('works if deploy command is executed with directory path', async () => {
    const act = deploy.getAction()
    const spy = jest.spyOn(deploy as any, 'getDeployCommand')
    await act(absoluteProcessDir)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('works if deploy command is not executed when no package.json', async () => {
    const act = deploy.getAction()
    const spy = jest.spyOn(deploy as any, 'getDeployCommand')
    await act(absoluteProcessDirNoPackage)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
