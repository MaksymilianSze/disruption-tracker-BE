exports.mapDisruptionRedditPosts = (posts, subreddit) => {
  if (!posts) {
    return [];
  }

  const result = {
    subreddit,
    posts: [],
  };

  posts.forEach((post) => {
    result.posts.push({
      title: post.title,
      body: post.selftext,
      image: post.url,
      createdAt: new Date(post.created_utc * 1000).toISOString(),
      comments: post.comments,
    });
  });

  return result;
};
