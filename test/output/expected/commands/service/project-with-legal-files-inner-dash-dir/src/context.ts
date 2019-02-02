import { Injector } from 'injection-js'
import { IAppContext } from './interfaces/IAppContext'
import { TrainsService } from './services/trains/TrainsService'
import { AbstractPubsubManager } from './graphql/subscriptions/Pubsub/AbstractPubsubManager'
import { DashCarService } from '@src/services/inner/dir/dash-car'

export function getContext(injector: Injector): IAppContext {
  return {
    dashCarService: injector.get(DashCarService),
    pubsubManager: injector.get(AbstractPubsubManager),
    trainsService: injector.get(TrainsService)
  }
}
