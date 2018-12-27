import { lowerFirst } from 'lodash'

export const servicePattern = /service/
export const contextPattern = /context/
export const contextInterfacePattern = /IAppContext/
export const injectorPattern = /injector/
export const serviceFilePrefix =
  "import {Injectable} from 'injection-js'\n\n" + '@Injectable()\n' + 'export class '
export const serviceFileSuffix = ' {\n}'
export const serviceFileNameSuffix = 'Service'
export const injectorStartSeparators = ['([']
export const contextStartSeparators = ['return {']
export const contextInterfaceStartSeparators = ['{']
export const injectorSignatureFn = (serviceName: string) => serviceName + ',\n'
export const contextSignatureFn = (serviceName: string) =>
  lowerFirst(serviceName) + ' : ' + 'injector.get(' + serviceName + '),\n'
export const contextInterfaceSignatureFn = (serviceName: string) =>
  lowerFirst(serviceName) + ' : ' + serviceName + ';\n'
