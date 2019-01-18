import { IAppContext } from '@src/interfaces/IAppContext'

const resolveFunctions = {
	Query: {
		Tweet(rootObj: any, args: any, context: IAppContext) {},
		Tweets(rootObj: any, args: any, context: IAppContext) {},
		TweetsMeta(rootObj: any, args: any, context: IAppContext) {},
		User(rootObj: any, args: any, context: IAppContext) {},
		Notifications(rootObj: any, args: any, context: IAppContext) {},
		NotificationsMeta(rootObj: any, args: any, context: IAppContext) {},
	},
	Mutation: {
		createTweet(rootObj: any, args: any, context: IAppContext) {},
		deleteTweet(rootObj: any, args: any, context: IAppContext) {},
		markTweetRead(rootObj: any, args: any, context: IAppContext) {},
	},
}

export default resolveFunctions
