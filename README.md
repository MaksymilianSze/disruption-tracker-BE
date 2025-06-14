Prerequisites:

- Node.js v23.9.0
- NPM v10.9.2
- MongoDB running on `mongodb://localhost:27017/disruption-tracker` with a replica set setup, or whatever URI you choose with the `.env` file changed

First:

1. Create a copy of `.env.example` and rename it to `.env`
2. Generate a random secure secret and replace the placeholder inside SESSION_SECRET

How to register for a TfL Unified API Application Key:

1. Register at: https://api-portal.tfl.gov.uk/
2. Replace the placholder value in `TFL_API_KEY` with your API key

How to get a Reddit API Keys:

1. Sign up for a Reddit account at: https://www.reddit.com/login/
2. Register a Web App & Personal at: https://old.reddit.com/prefs/apps
3. Register to use the Reddit API: https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164
4. Edit the callback URI on your app https://old.reddit.com/prefs/apps to be `http://localhost:5000/auth/reddit/callback` or whatever the port or URI you decide to run it on
5. Use the values obtained from the Personal Script and your Reddit Account to replace in the placeholder values in OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, REDDIT_USERNAME, and REDDIT_PASSWORD
6. Use the values obtained from the Web App to replace in the placeholder values in USER_CLIENT_OAUTH_CLIENT_ID, USER_CLIENT_OAUTH_CLIENT_SECRET, REDIRECTURI

How to run the app in development mode:

1. Run `npm install`
2. Run `npm run dev`
3. API and Websocket server should now be running on `http://localhost:5000`
