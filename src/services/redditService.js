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

  let commentPromises = [];

  for (const post of flattenedPosts) {
    commentPromises.push(post.expandReplies({ limit: 10 }));
  }

  const comments = await Promise.all(commentPromises);

  for (let i = 0; i < flattenedPosts.length; i++) {
    flattenedPosts[i].comments = comments[i].comments || [];
  }

  return flattenedPosts;
};

exports.createDisruptionPost = async (title, body, redditAuth) => {
  const userRedditClient = new snoowrap({
    userAgent: "disruption-tracker/1.0 by TrainTrackerman",
    accessToken: redditAuth.accessToken,
    refreshToken: redditAuth.refreshToken,
    clientId: process.env.USER_CLIENT_OAUTH_CLIENT_ID,
    clientSecret: process.env.USER_CLIENT_OAUTH_CLIENT_SECRET,
  });

  const createdPost = await userRedditClient
    .getSubreddit("DisruptionTracker")
    .submitSelfpost({
      title: title,
      text: body,
    });

  return createdPost;
};
