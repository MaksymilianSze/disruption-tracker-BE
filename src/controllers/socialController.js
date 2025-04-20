const { getDisruptionPosts } = require("../services/redditService");
const { mapDisruptionRedditPosts } = require("../utils/redditMapper");

const DEFAULT_TIMES = ["all", "hour", "day", "week", "month", "year"];

exports.getDisruptionPosts = async (req, res, next) => {
  try {
    const { queryTerms, time } = req.query;
    const { lineName } = req.validatedQuery;

    if (!queryTerms) {
      return res.status(400).json({
        error: "Query terms are required",
      });
    }

    if (!time || !DEFAULT_TIMES.includes(time)) {
      return res.status(400).json({
        error: `Invalid time: ${time}. Must be one of: ${DEFAULT_TIMES.join(
          ", "
        )}`,
      });
    }

    const queryTermsArray = queryTerms.split(",").map((term) => term.trim());

    const posts = await getDisruptionPosts({
      queryTerms: queryTermsArray,
      time: time,
    });

    const mappedPosts = mapDisruptionRedditPosts(posts, lineName);
    res.json({ result: mappedPosts });
  } catch (error) {
    next(error);
  }
};
