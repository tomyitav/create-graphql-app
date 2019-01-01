import * as _ from 'lodash'

export const servicePattern = /service/
export const contextPattern = /context/
export const contextInterfacePattern = /IAppContext/
export const injectorPattern = /injector/
export const serviceFilePrefix =
  "import {Injectable} from 'injection-js'\n\n" + '@Injectable()\n' + 'export class '
export const importServicePrefix = '@src/services'
export const serviceFileSuffix = ' {\n}'
export const serviceFileNameSuffix = 'Service'
export const injectorStartSeparators = ['([']
export const contextStartSeparators = ['return {']
export const contextInterfaceStartSeparators = ['{']
export const injectorSignatureFn = (serviceName: string) => '  ' + serviceName + ','
export const contextSignatureFn = (serviceName: string) =>
  '    ' + _.lowerFirst(serviceName) + ': ' + 'injector.get(' + serviceName + '),'
export const contextInterfaceSignatureFn = (serviceName: string) =>
  '  ' + _.lowerFirst(serviceName) + ': ' + serviceName
