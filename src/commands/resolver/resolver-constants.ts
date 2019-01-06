export const resolverPrefix =
  "import { IAppContext } from '@src/interfaces/IAppContext'\n\nconst resolveFunctions = {\n"
export const resolverSuffix = '};\n'
export const operationPrefix = ': {\n'
export const operationSuffix = '\t},\n'
export const operationFuntionsSuffix = '\t},\n'
export const functionOperationPrefix = ' => {},\n'
export const gqlMethodSignature = '(rootObj: any, args: any, context: IAppContext)'
export const gqlMethodSuffix = ' {},\n'
export const subscriptionSubscribeDefinition = '\t\t\tsubscribe: '
export const keysToGenerate = ['Query', 'Mutation', 'Subscription']
