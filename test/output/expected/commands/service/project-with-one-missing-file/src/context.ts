import {Injector} from 'injection-js'
import {IAppContext} from './interfaces/IAppContext'
import {TrainsService} from './services/trains/TrainsService'
import {AbstractPubsubManager} from './graphql/subscriptions/Pubsub/AbstractPubsubManager'
import { CarService } from '@src/services/car'

export function getContext(injector: Injector): IAppContext {
  return {
    carService: injector.get(CarService),
	pubsubManager: injector.get(AbstractPubsubManager),
	trainsService: injector.get(TrainsService)
  }
}
