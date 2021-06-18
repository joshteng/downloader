const fs = require('fs');
const WebTorrent = require('webtorrent');
const cliProgress = require('cli-progress');

function download(torrentId) {
  function _download(torrent) {
    const downloadPath = process.env.DOWNLOAD_PATH || './downloads' + '/' + new Date().getTime()
    fs.mkdirSync(downloadPath)
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const files = torrent.files;
    let length = files.length;
    console.log("Number of files:- \t" + length);

    bar.start(100, Math.round(torrent.progress * 10000) / 100);

    let interval = setInterval(() => {
      bar.update(Math.round(torrent.progress * 10000) / 100);
      // console.log("Progress :" + (torrent.progress * 100).toFixed() + "%")
    }, 100);

    files.forEach(file => {
      const source = file.createReadStream();
      const destination = fs.createWriteStream(downloadPath + '/' + file.name);
      source.on('end', () => {
        // console.log('file: \t\t', file.name);
        length -= 1;

        if (!length) {
          bar.stop();
          clearInterval(interval);
          client.destroy()
          // console.log('process exited')
          process.exit()
        }
      }).pipe(destination)
    })
  }
  const client = new WebTorrent();
  const torrent = client.get(torrentId);

  if (torrent) {
    client.destroy()
    process.exit()
  }

  client.add(torrentId, torrent => {
    torrent.on('error', err => {
      console.log(err)
    })
    _download(torrent)
  })
}

process.on('message', (msg) => {
  download(msg.torrentId)
});
