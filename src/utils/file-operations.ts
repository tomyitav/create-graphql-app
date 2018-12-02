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

export function fileExists(pathToFile: string): Promise<boolean> {
  return new Promise(resolve => {
    fs.stat(pathToFile, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats.isFile())
      }
    })
  })
}

export function readFileContent(pathToFile: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}
