const fs = require('fs');
const WebTorrent = require('webtorrent');
const express = require('express')
const cliProgress = require('cli-progress');
const client = new WebTorrent();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));


async function download(torrentId) {
  new Promise((resolve, reject) => {
    client.add(torrentId, torrent => {
      const downloadPath = process.env.DOWNLOAD_PATH || './downloads' + '/' + new Date().getTime()
      fs.mkdirSync(downloadPath)
      const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      const files = torrent.files;
      let length = files.length;
      console.log("Number of files:- \t" + length);

      bar.start(100, 0);
      let interval = setInterval(() => {
        bar.update(Math.round(torrent.progress * 10000) / 100);
        // console.log("Progress :" + (torrent.progress * 100).toFixed() + "%")
      }, 1000);

      files.forEach(file => {
        const source = file.createReadStream();
        const destination = fs.createWriteStream(downloadPath + '/' + file.name);
        source.on('end', () => {
          // console.log('file: \t\t', file.name);
          length -= 1;

          if (!length) {
            bar.stop();
            clearInterval(interval);
            process.exit();
          }
        }).pipe(destination)
      })
    })
  })
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.post('/', (req, res) => {
  const torrentId = req.body['magnet_link']
  console.log("Downloading Torrent Id:- \t" + torrentId);
  download(torrentId)
  res.send("Downloading!")
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
