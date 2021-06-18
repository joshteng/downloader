# Download Torrent to Your Server

Submit a magnet link from anywhere and begin downloading torrent on your server!

**Strictly not for piracy!**
Please use it for legitimate distributed file sharing.

<img src="https://github.com/joshteng/downloader/blob/master/docs/mobile.jpg?raw=true" height="500">

To start:
```
npm install
node index.js
```

Go to your browser. Default port 3001
```
http://localhost:3001
```

Customization via Environment Variables
```
PORT=8080 # optional. if not set, defaults to 3001
DOWNLOAD_PATH=<ABSOLUTE_PATH> # optional. if not set, creates a `downloads` directory at root of app directory for downloads
USERNAME="<YOUR_USERNAME_FOR_BASIC_AUTH>" # see note below
PASSWORD="<YOUR_PASSWORD_FOR_BASIC_AUTH>" # see note below
```

Set username and password env variables to use basic auth else no authentication will be used and if exposed to public network, anyone can start downloads to your computer / server.
