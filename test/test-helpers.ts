import * as fs from 'fs'

export const compareTestFilesByPaths = (
  pathToActual: string,
  pathToExpected: string,
  shouldEqual: boolean = true
) => {
  const actualContent = fs
    .readFileSync(pathToActual)
    .toString()
    .replace(/\s/g, '')
  const expectedContent = fs
    .readFileSync(pathToExpected)
    .toString()
    .replace(/\s/g, '')

  if (shouldEqual) {
    expect(actualContent).toEqual(expectedContent)
  } else {
    expect(actualContent).not.toEqual(expectedContent)
  }
}
