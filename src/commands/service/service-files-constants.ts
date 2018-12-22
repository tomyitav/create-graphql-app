export const servicePattern = /service/
export const contextPattern = /context/
export const injectorPattern = /injector/
export const serviceFilePrefix =
  "import {Injectable} from 'injection-js'\n\n" + '@Injectable()\n' + 'export class '
export const serviceFileSuffix = ' {\n}'
export const serviceFileNameSuffix = 'Service'
