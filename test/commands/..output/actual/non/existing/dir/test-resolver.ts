const resolveFunctions = {
	Query: {
		car(rootObj: any, args: any, context: any) {},
	},
	Mutation: {
		updateCarName(rootObj: any, args: any, context: any) {},
	},
	Subscription: {
		carChanged: {
			subscribe: (rootObj: any, args: any, context: any) => {},
		},
	},
};
