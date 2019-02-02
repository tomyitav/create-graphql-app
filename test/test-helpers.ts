import * as fs from 'fs'

export const compareTestFilesByPaths = (
  pathToActual: string,
  pathToExpected: string,
  shouldEqual: boolean = true,
  shouldIgnoreSpaces: boolean = true
) => {
  const actualContent = fs.readFileSync(pathToActual).toString()
  if (shouldIgnoreSpaces) {
    actualContent.replace(/\s/g, '')
  }

  const expectedContent = fs.readFileSync(pathToExpected).toString()
  if (shouldIgnoreSpaces) {
    expectedContent.replace(/\s/g, '')
  }

  if (shouldEqual) {
    expect(actualContent).toEqual(expectedContent)
  } else {
    expect(actualContent).not.toEqual(expectedContent)
  }
}
