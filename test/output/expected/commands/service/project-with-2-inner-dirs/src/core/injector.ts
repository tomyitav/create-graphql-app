import {Injector, ReflectiveInjector} from 'injection-js'
import 'reflect-metadata'
import 'zone.js'
import {AbstractPubsubManager} from '../graphql/subscriptions/Pubsub/AbstractPubsubManager'
import {PubsubManager} from '../graphql/subscriptions/Pubsub/PubsubManager'
import {TrainsService} from '../services/trains/TrainsService'
import {Server} from '../server'
import {AbstractSetting} from './config/AbstractSetting'
import {Setting} from './config/Setting'
import {AbstractLogger} from './logger/AbstractLogger'
import {Logger} from './logger/Logger'
import { CarService } from '@src/services/car'

const injector: Injector = ReflectiveInjector.resolveAndCreate([
  CarService,
  {provide: AbstractLogger, useClass: Logger},
  {provide: AbstractSetting, useClass: Setting},
  {provide: AbstractPubsubManager, useClass: PubsubManager},
  Server,
  TrainsService
])

export default injector
