exports.mapDisruptionRedditPosts = (posts, subreddits) => {
  const result = {
    subreddits,
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
      title: post.title,
      body: post.selftext,
      image: post.url,
      createdAt: new Date(post.created_utc * 1000).toISOString(),
      author: post.author?.name || "unknown",
      subreddit: post.subreddit?.display_name || post.subreddit,
      permalink: `https://reddit.com${post.permalink}`,
    });
  });

  result.posts.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return result;
};
