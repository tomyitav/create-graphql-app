import {
  fileExists,
  locateFile,
  readFileContent,
  writeToFile
} from '../../../src/utils/file-operations'
import * as path from 'path'
import * as fs from 'fs'

describe('test file-operation module functions', () => {
  const pathToExpectedFile = path.join(__dirname, '../../output/expected/utils/sample-file.ts')
  const pathToNonExistingFile = path.join(
    __dirname,
    '../../test/output/expected/utils/sample-file1.ts'
  )
  const pathToFileToWrite = path.join(__dirname, '../../output/actual/test-write-file.ts')
  const pathToIllegalExtension = path.join(__dirname, '../../output/actual/test-write-file.t')
  const pathToLocate = path.join(__dirname, '../../output/expected/utils')

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

  it('works if managed to locate directory content', async () => {
    const dirsFound = await locateFile(/locate/, pathToLocate, 'dir')
    expect(dirsFound.length).toBe(1)
    const filesFound = await locateFile(/file-to-locate.ts/, pathToLocate, 'file')
    expect(filesFound.length).toBe(1)
    const dirsFoundNonExisting = await locateFile(/non-existing-dir/, pathToLocate, 'dir')
    expect(dirsFoundNonExisting.length).toBe(0)
    const filesFoundNonExisting = await locateFile(/non-existing-file.ts/, pathToLocate, 'file')
    expect(filesFoundNonExisting.length).toBe(0)
  })

  it('works if locating undefined pattern fails on dir', () => {
    return expect(locateFile(undefined, pathToLocate, 'dir')).rejects.toEqual(
      'Illegal pattern received in locate function'
    )
  })
})
