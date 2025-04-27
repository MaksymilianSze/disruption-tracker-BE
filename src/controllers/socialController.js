const {
  getDisruptionPosts,
  createDisruptionPost,
} = require("../services/redditService");
const { mapDisruptionRedditPosts } = require("../utils/redditMapper");
const snoowrap = require("snoowrap");

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

    const mappedPosts = mapDisruptionRedditPosts(posts, lineName, time);
    res.json({ result: mappedPosts });
  } catch (error) {
    next(error);
  }
};

exports.createDisruptionPost = async (req, res, next) => {
  try {
    if (!req.session.redditAuth) {
      return res.status(401).json({ error: "Not authenticated with Reddit" });
    }

    const { title, body } = req.body;

    const createdPost = await createDisruptionPost(
      title,
      body,
      req.session.redditAuth
    );

    res.json({ result: createdPost });
  } catch (error) {
    next(error);
  }
};

exports.auth = async (req, res, next) => {
  try {
    const { code } = req.query;

    const redditUserClient = await snoowrap.fromAuthCode({
      code,
      userAgent: "disruption-tracker/1.0 by TrainTrackerman",
      clientId: process.env.USER_CLIENT_OAUTH_CLIENT_ID,
      clientSecret: process.env.USER_CLIENT_OAUTH_CLIENT_SECRET,
      redirectUri: "http://localhost:5000/api/auth/reddit/callback",
    });

    req.session.redditAuth = {
      accessToken: redditUserClient.accessToken,
      refreshToken: redditUserClient.refreshToken,
    };

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'REDDIT_AUTH_SUCCESS' }, 'http://localhost:5173');
            window.close();
          </script>
          <p>Authentication successful. You can close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
};

exports.checkAuthStatus = async (req, res, next) => {
  res.json({
    authenticated: !!req.session.redditAuth,
    user: req.session.redditAuth || null,
  });
};

exports.logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
  });
  res.clearCookie("connect.sid");
  res.json({ success: true });
};
