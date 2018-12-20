import { AbstractCommand } from '../../../src/commands/abstract-command'
import { Service } from '../../../src/commands/service'

describe('test for service command', () => {
  let service: AbstractCommand

  beforeAll(() => {
    service = new Service()
  })

  it('works if action returns a function', () => {
    const act = service.getAction()
    expect(act).toBeInstanceOf(Function)
  })
})
