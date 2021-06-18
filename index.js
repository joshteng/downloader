if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

const dir = require('path').dirname(require.main.filename)
const { fork } = require('child_process');
const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express();
const port = process.env.PORT || 3001;


if (process.env.USERNAME && process.env.PASSWORD) {
  const cred = {}
  cred[process.env.USERNAME] = process.env.PASSWORD

  app.use(basicAuth({
    users: cred,
    challenge: true
  }))

  // console.log(`using credentials ${JSON.stringify(cred)}`)
}

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.post('/', (req, res) => {
  const torrentId = req.body['magnet_link']
  console.log("Downloading Torrent Id:- \t" + torrentId);
  const forked = fork(`${dir}/download.js`);
  forked.send({ torrentId: torrentId });
  res.sendFile(__dirname + '/public/success.html');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
