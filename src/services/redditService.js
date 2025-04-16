const snoowrap = require("snoowrap");

const redditClient = new snoowrap({
  userAgent: "disruption-tracker/1.0 by TrainTrackerman",
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

exports.getDisruptionPosts = async (params) => {
  const { queryTerm, subreddit = "DisruptionTracker" } = params;
  if (!queryTerm) {
    const posts = await redditClient.getSubreddit(subreddit).getNew({
      limit: 10,
    });
    return posts;
  }
  const posts = await redditClient.search({
    query: queryTerm,
    subreddit: subreddit,
    sort: "new",
    limit: 10,
  });
  return posts;
};
