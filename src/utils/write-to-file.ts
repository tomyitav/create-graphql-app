import * as fs from 'fs'

export function writeToFile(pathToFile: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathToFile, content, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
