import { fileExists, readFileContent, writeToFile } from '../../../src/utils/file-operations'
import * as fs from 'fs'

describe('test file-operation module functions', () => {
  const pathToExpectedFile = './test/output/expected/utils/sample-file.ts'
  const pathToNonExistingFile = './test/output/expected/utils/sample-file1.ts'
  const pathToFileToWrite = './test/output/actual/test-write-file.ts'
  const pathToIllegalExtension = './test/output/actual/test-write-file.t'

  afterEach(() => {
    if (fs.existsSync(pathToFileToWrite)) {
      fs.unlinkSync(pathToFileToWrite)
    }
  })

  it('works if file exists returns true on existing file', async () => {
    const exists = await fileExists(pathToExpectedFile)
    expect(exists).toBeTruthy()
  })

  it('works if file exists returns false on non-existing file', async () => {
    const exists = await fileExists(pathToNonExistingFile)
    expect(exists).not.toBeTruthy()
  })

  it('works if reading file returns correct content', async () => {
    const fileContent = await readFileContent(pathToExpectedFile)
    expect(typeof fileContent).toBe('string')
  })

  it('works if managed to write file content', async () => {
    await writeToFile(pathToFileToWrite, 'Test writing content')
    expect(fs.existsSync(pathToFileToWrite)).toBeTruthy()
  })

  it('works if writing to file with wrong extension fails', () => {
    return expect(writeToFile(pathToIllegalExtension, 'Test writing content')).rejects.toEqual(
      'Illegal file extension.. only .ts extensions are allowed'
    )
  })
})
