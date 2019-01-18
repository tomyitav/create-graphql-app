import { IAppContext } from '@src/interfaces/IAppContext'

const resolveFunctions = {
  Query: {
    car(rootObj: any, args: any, context: IAppContext) {},
  },
  Mutation: {
    updateCarName(rootObj: any, args: any, context: IAppContext) {},
  },
  Subscription: {
    carChanged: {
      subscribe: (rootObj: any, args: any, context: IAppContext) => {},
    },
  },
}

export default resolveFunctions
