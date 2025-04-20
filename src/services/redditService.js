const snoowrap = require("snoowrap");

const redditClient = new snoowrap({
  userAgent: "disruption-tracker/1.0 by TrainTrackerman",
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

exports.getDisruptionPosts = async (params) => {
  const { queryTerms, time = "all" } = params;

  let searchPromises = [];

  searchPromises.push(
    redditClient.getSubreddit("DisruptionTracker").getNew({
      limit: 100,
    })
  );

  for (const queryTerm of queryTerms) {
    searchPromises.push(
      redditClient.search({
        query: queryTerm,
        subreddit: "LondonUnderground",
        sort: "new",
        time: time,
        limit: 100,
      })
    );
  }

  const posts = await Promise.all(searchPromises);

  const flattenedPosts = posts.flat();

  return flattenedPosts;
};
