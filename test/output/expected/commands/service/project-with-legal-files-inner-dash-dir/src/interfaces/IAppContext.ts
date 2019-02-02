import { AbstractPubsubManager } from '../graphql/subscriptions/Pubsub/AbstractPubsubManager'
import { TrainsService } from '../services/trains/TrainsService'
import { DashCarService } from '@src/services/inner/dir/dash-car'

export interface IAppContext {
  dashCarService: DashCarService
  pubsubManager: AbstractPubsubManager
  trainsService: TrainsService
}
