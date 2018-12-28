import { Injector } from 'injection-js'
import { IAppContext } from './interfaces/IAppContext'
import { TrainsService } from './services/trains/TrainsService'
import { AbstractPubsubManager } from './graphql/subscriptions/Pubsub/AbstractPubsubManager'

export function getContext(injector: Injector): IAppContext {
  return {
    pubsubManager: injector.get(AbstractPubsubManager),
    trainsService: injector.get(TrainsService)
  }
}
