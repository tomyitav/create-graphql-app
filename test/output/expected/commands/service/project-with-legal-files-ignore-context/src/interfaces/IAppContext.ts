import { AbstractPubsubManager } from '../graphql/subscriptions/Pubsub/AbstractPubsubManager'
import { TrainsService } from '../services/trains/TrainsService'

export interface IAppContext {
  pubsubManager: AbstractPubsubManager
  trainsService: TrainsService
}
