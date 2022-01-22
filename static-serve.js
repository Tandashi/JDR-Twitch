const express = require('express');
const app = express();

app.listen(8080, function () {
  console.log('Serving Static on 8080');
});

const twitchextensioncsp = require('twitchextensioncsp');
app.use(
  twitchextensioncsp({
    clientID: 'nv9ue0u2753fk3n1n9ghrvd28e3r9v',
    imgSrc: ['https://jd.tandashi.de', 'https://jd-dev.tandashi.de', 'https://img.shields.io/'],
    mediaSrc: ['https://jd.tandashi.de', 'https://jd-dev.tandashi.de'],
    connectSrc: ['https://jd.tandashi.de', 'https://jd-dev.tandashi.de', 'https://api.twitch.tv'],
  })
);

app.use('/', express.static(__dirname + '/dist/rollup/'));
