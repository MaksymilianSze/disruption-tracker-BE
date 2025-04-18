const { getDisruptionPosts } = require("../services/redditService");
const { mapDisruptionRedditPosts } = require("../utils/redditMapper");

const DEFAULT_SUBREDDITS = [
  "DisruptionTracker",
  "LondonTube",
  "LondonUnderground",
  "uktrains",
  "LondonOverground",
  "TransportForLondon",
];

exports.getDisruptionPosts = async (req, res, next) => {
  try {
    const { queryTerms, subreddits } = req.query;

    if (!queryTerms || !subreddits) {
      return res.status(400).json({
        error: "Query term and subreddits are required",
      });
    }

    const subredditArray = subreddits.split(",").map((sub) => sub.trim());

    const invalidSubreddits = subredditArray.filter(
      (sub) => !DEFAULT_SUBREDDITS.includes(sub)
    );

    if (invalidSubreddits.length > 0)
      return res.status(400).json({
        error: `Invalid subreddit(s): ${invalidSubreddits.join(
          ", "
        )}. Must be one of: ${DEFAULT_SUBREDDITS.join(", ")}`,
      });

    const queryTermsArray = queryTerms.split(",").map((term) => term.trim());

    const posts = await getDisruptionPosts({
      queryTerms: queryTermsArray,
      subreddits: subredditArray,
    });

    const mappedPosts = mapDisruptionRedditPosts(posts, subredditArray);
    res.json({ result: mappedPosts });
  } catch (error) {
    next(error);
  }
};
