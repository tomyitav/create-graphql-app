import * as fs from 'fs'
import * as path from 'path'
import * as fse from 'fs-extra'
import * as find_ from 'find'
const find = find_

const allowedFileExtensions = ['.ts']

export type FileType = 'file' | 'dir'
export type LetterModifyType = 'lower' | 'upper'

export function writeToFile(pathToFile: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pathProps = path.parse(pathToFile)
    if (!allowedFileExtensions.includes(pathProps.ext)) {
      reject('Illegal file extension.. only ' + allowedFileExtensions + ' extensions are allowed')
      return
    }
    fse.ensureDir(pathProps.dir, err => {
      if (err) {
        reject(err)
        return
      }
      fs.writeFile(pathToFile, content, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
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

export function locateFile(
  pattern: object | undefined,
  rootPath: string,
  fileType: FileType
): Promise<string[]> {
  const locatingFunction = fileType === 'file' ? find.file : find.dir
  return new Promise((resolve, reject) => {
    if (!pattern) {
      reject('Illegal pattern received in locate function')
    }
    locatingFunction(pattern, rootPath, (results: string[]) => {
      resolve(results)
    }).error((err: any) => {
      if (err) {
        reject(err)
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

export function findCommonPath(stringsToCheck: string[]): string {
  if (Array.isArray(stringsToCheck) && stringsToCheck.length > 0) {
    if (stringsToCheck.length === 1) {
      return stringsToCheck[0]
    }
    const sortedArray = stringsToCheck.concat().sort()
    const first = sortedArray[0]
    const last = sortedArray[sortedArray.length - 1]
    const L = first.length
    let i = 0
    while (i < L && first.charAt(i) === last.charAt(i)) i++
    return first.substring(0, i)
  } else {
    return ''
  }
}
