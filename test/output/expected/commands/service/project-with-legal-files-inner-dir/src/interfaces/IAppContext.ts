import { AbstractPubsubManager } from '../graphql/subscriptions/Pubsub/AbstractPubsubManager'
import { TrainsService } from '../services/trains/TrainsService'
import { CarService } from '@src/services/inner/dir/car'

export interface IAppContext {
  carService: CarService
  pubsubManager: AbstractPubsubManager
  trainsService: TrainsService
}
