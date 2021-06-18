const dir = require('path').dirname(require.main.filename)
const { fork } = require('child_process');
const express = require('express')
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.post('/', (req, res) => {
  const torrentId = req.body['magnet_link']
  // console.log("Downloading Torrent Id:- \t" + torrentId);
  const forked = fork(`${dir}/download.js`);
  forked.send({ torrentId: torrentId });
  res.send("Downloading!")
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
