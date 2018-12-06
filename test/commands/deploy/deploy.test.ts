import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Deploy } from '../../../src/commands/deploy'

describe.only('test for deploy command', () => {
  let deploy: AbstractCommand

  beforeAll(() => {
    deploy = new Deploy()
  })

  afterEach(() => {})

  it('works if action returns a function', () => {
    const act = deploy.getAction()
    expect(act).toBeInstanceOf(Function)
  })

  it('works if deploy command is executed in directory', async () => {
    const act = deploy.getAction()
    const spy = jest.spyOn(deploy as any, 'getDeployCommand')
    await act(undefined)
    expect(spy).toHaveBeenCalled()
  })
})
