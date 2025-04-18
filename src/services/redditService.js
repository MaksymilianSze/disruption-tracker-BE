const snoowrap = require("snoowrap");

const redditClient = new snoowrap({
  userAgent: "disruption-tracker/1.0 by TrainTrackerman",
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

exports.getDisruptionPosts = async (params) => {
  const { queryTerms, subreddits } = params;

  const searchPromises = subreddits.map((subreddit) => {
    for (const queryTerm of queryTerms) {
      return redditClient.search({
        query: queryTerm,
        subreddit: subreddit,
        sort: "new",
        limit: 10,
      });
    }
  });

  const posts = await Promise.all(searchPromises);

  const flattenedPosts = posts.flat();

  console.log(flattenedPosts);

  return flattenedPosts;
};
