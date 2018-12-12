import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Deploy } from '../../../src/commands/deploy'

describe('test for deploy command', () => {
  let deploy: AbstractCommand
  const pathToProjectDir = './test/commands/deploy/inner-dir'
  const pathToProjectNoPackage = './test/commands/deploy/inner-dir-no-package'

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
    await act(pathToProjectDir)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('works if deploy command is not executed when no package.json', async () => {
    const act = deploy.getAction()
    const spy = jest.spyOn(deploy as any, 'getDeployCommand')
    await act(pathToProjectNoPackage)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
