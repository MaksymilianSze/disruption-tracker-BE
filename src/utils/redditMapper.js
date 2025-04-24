const { allowedVariationsMapper } = require("./allowedVariationsMapper");

const timeFilters = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

exports.mapDisruptionRedditPosts = (posts, lineName, time) => {
  const result = {
    posts: [],
  };

  if (!posts || !posts.length) {
    return result;
  }

  const uniquePostKeys = new Set();

  posts.forEach((post) => {
    const uniqueKey = `${post.created_utc}_${post.title.substring(0, 30)}`;

    if (uniquePostKeys.has(uniqueKey)) {
      return;
    }

    uniquePostKeys.add(uniqueKey);

    result.posts.push({
      id: post.id,
      title: post.title,
      body: post.selftext,
      image: post.url,
      createdAt: new Date(post.created_utc * 1000).toISOString(),
      author: post.author?.name || "unknown",
      subreddit: post.subreddit?.display_name || post.subreddit,
      permalink: `https://reddit.com${post.permalink}`,
      flair: post.link_flair_text,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        body: comment.body,
        author: comment.author?.name ?? "unknown",
        createdAt: new Date(comment.created_utc * 1000).toISOString(),
      })),
    });
  });

  result.posts.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (time && time !== "all") {
    const now = new Date();

    const timeLimit = timeFilters[time];
    if (timeLimit) {
      result.posts = result.posts.filter((post) => {
        const postDate = new Date(post.createdAt);
        return now - postDate <= timeLimit;
      });
    }
  }

  if (lineName) {
    const allowedVariations = allowedVariationsMapper(lineName);
    if (allowedVariations) {
      result.posts = result.posts.filter((post) =>
        allowedVariations.some(
          (variation) =>
            post.title?.toLowerCase()?.includes(variation.toLowerCase()) ||
            post.body?.toLowerCase()?.includes(variation.toLowerCase()) ||
            post.flair?.toLowerCase()?.includes(variation.toLowerCase())
        )
      );
    } else {
      result.posts = [];
    }
  }

  return result;
};
