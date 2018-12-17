const resolveFunctions = {
	Query: {
		Tweet(rootObj: any, args: any, context: any) {},
		Tweets(rootObj: any, args: any, context: any) {},
		TweetsMeta(rootObj: any, args: any, context: any) {},
		User(rootObj: any, args: any, context: any) {},
		Notifications(rootObj: any, args: any, context: any) {},
		NotificationsMeta(rootObj: any, args: any, context: any) {},
	},
	Mutation: {
		createTweet(rootObj: any, args: any, context: any) {},
		deleteTweet(rootObj: any, args: any, context: any) {},
		markTweetRead(rootObj: any, args: any, context: any) {},
	},
};
