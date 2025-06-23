Installing Node.js:

Windows:

1. Open your browser and go to https://nodejs.org/en/download and select version v23.11.1 and download the Windows Installer (.msi)
2. Go to your downloads folder and use the installer, ensure "Add to PATH" is checked
3. To verify that the install worked open command prompt and run `node -v`, the output should be v23.11.1

macOS & Linux:

1. Open a terminal and run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh`
2. Restart your terminal
3. Run `nvm install v23.11.1`
4. To verify that the install worked run `node -v` in your shell, the output should be v23.11.1

Setting up MongoDB:
Windows:

1. Open your browser and go to https://www.mongodb.com/try/download/community and download the Windows Installer (.msi) for the latest version
2. Run the installer and enable MongoDB and choose "complete" and then "Install MongoD as a Service"
3. Now go to https://www.mongodb.com/try/download/community and download the Windows Installer (.msi) for the latest version
4. Run the installer
5. If not already present, add mongosh to your system PATH: Start -> "Environment Variables" -> Edit system variables -> Path -> Add -> Paste path "C:\Users\[{user}\AppData\Local\Programs\mongosh\" where {user} is your windows user
6. Verify the install worked by running `mongosh` in command prompt and checking if the command is recognised
7. Open file explorer and go to `C:\Program Files\MongoDB\Server\x.x\bin\` where "x.x" is the version you installed
8. Open the `mongod.cfg` file with notepad and add or edit the replication to be as follows:
   replication:
   replSetName: "rs0"
9. Ensure the net configuration looks like the following, if not change it:
   net:
   port: 27017
   bindIp: 127.0.0.1
10. Open command prompt and run `net stop MongoDB` then `net start MongoDB`
11. Then run `mongosh` then `rs.initiate()`

macOS:

1. Install Homebrew (if not already installed), open a terminal and run `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. Follow the on screen instructions then run `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"'` and `eval "$(/opt/homebrew/bin/brew shellenv)"` to verify the install
3. Run `brew tap mongodb/brew` and `brew install mongodb-community@8.0`
4. Run `sudo nano /opt/homebrew/etc/mongod.conf` and update replication to be as follows:
   replication:
   replSetName: "rs0"
5. Ensure the net configuration is as follows:
   net:
   port: 27017
   bindIp: 127.0.0.1
6. Run `brew services start mongodb-community@8.0`
7. Run `mongosh` then `rs.initiate()`

Linux:

1. Open a bash terminal and run `sudo apt update` and `sudo apt install -y mongodb`
2. Run `sudo nano /etc/mongod.conf` and modify the replication to be as follows:
   replication:
   replSetName: "rs0"
3. Ensure the net configuration is as follows:
   net:
   port: 27017
   bindIp: 127.0.0.1
4. Run `sudo service mongod stop` then `sudo service mongod start`
5. Run `mongosh` then `rs.initiate()`

Setting up the Back-End:

1. Important note for markers, you must use the source files found in the Moodle submission rather than from GitHub otherwise secret key values will be missing from the environment file
2. Navigate inside "disruption-tracker-BE" and open a terminal in this location, or command prompt for Windows
3. Run `npm install`
4. Run `npm run dev` to start the server

---OPTIONAL SETUP BELOW IF YOU WISH TO OBTAIN AND USE YOUR OWN API KEYS---

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
