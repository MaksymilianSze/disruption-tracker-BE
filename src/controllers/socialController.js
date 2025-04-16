const { getDisruptionPosts } = require("../services/redditService");
const { mapDisruptionRedditPosts } = require("../utils/redditMapper");
const subreddits = [
  "DisruptionTracker",
  "LondonTube",
  "LondonUnderground",
  "uktrains",
  "LondonOverground",
  "TransportForLondon",
];

exports.getDisruptionPosts = async (req, res, next) => {
  try {
    const { queryTerm, subreddit } = req.query;

    if (subreddit && !subreddits.includes(subreddit)) {
      return res.status(400).json({
        error:
          "Subreddit must be one of the following: " + subreddits.join(", "),
      });
    }

    const posts = await getDisruptionPosts({ queryTerm, subreddit });

    const mappedPosts = mapDisruptionRedditPosts(posts, subreddit);
    res.json({ posts: mappedPosts });
  } catch (error) {
    next(error);
  }
};
