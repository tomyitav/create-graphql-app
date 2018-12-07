import logger from '../../../src/utils/logger'

describe('test cli logger', () => {
  it('works if logger has logging functions', () => {
    expect(logger.debug).toBeInstanceOf(Function)
    expect(logger.info).toBeInstanceOf(Function)
    expect(logger.warn).toBeInstanceOf(Function)
    expect(logger.error).toBeInstanceOf(Function)
  })
})
