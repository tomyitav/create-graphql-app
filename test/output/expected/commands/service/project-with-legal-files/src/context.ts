import {Injector} from 'injection-js';
import {IAppContext} from './interfaces/IAppContext';
import {TrainsService} from './services/trains/TrainsService';
import {AbstractPubsubManager} from './graphql/subscriptions/Pubsub/AbstractPubsubManager';
import {CarsService} from './services/cars/CarsService';

export function getContext(injector: Injector): IAppContext {
	return {
		carsService: injector.get(CarsService),
		pubsubManager: injector.get(AbstractPubsubManager),
		trainsService: injector.get(TrainsService)
	};
}
