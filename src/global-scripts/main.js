'use strict';

const CLIENT_ID = 'c1403ffbfd4948a38e7f00b3f1e126ef';
const CLIENT_SECRET = 'c287e31a3ee34d3dbea25f359c7d1576';

const playlist = document.querySelector('.playlist__content');

const authorize = async function () {
  let result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        ethereumjs.Buffer.Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString(
          'base64'
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  result = await result.json();

  return result.access_token;
};

const fetchData = async function () {
  const token = await authorize();

  let result = await fetch(
    'https://api.spotify.com/v1/playlists/37i9dQZEVXbNG2KDcFcKOF/tracks',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  result = await result.json();
  // console.log(result);
  return result;
};

const convertDuration = function (milis) {
  let minutes = Math.floor(milis / 60000);
  let seconds = ((milis % 60000) / 1000).toFixed(0);

  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

const createPlaylist = async function () {
  const data = await fetchData();
  const dataArr = data['items'];
  console.log(dataArr);

  for (let item = 0; item < dataArr.length; item++) {
    playlist.innerHTML += `
          <div class="song-card flex">
            <div class="song-info flex">
              <p class="number">${item < 9 ? '0' + (item + 1) : item + 1}</p>
              <img src="${dataArr[item].track.album.images[2].url}" />
              <div class="details">
                <p class="album-name">${dataArr[item].track.album.name}</p>
                <h4 class="song-name">${dataArr[item].track.name}</h4>
              </div>
            </div>
            <div class="more-info flex display-none">
              <div>
                <p>Artists</p>
                <h4 class="artist">${dataArr[item].track.artists
                  .map((artist) => artist.name)
                  .join(', ')}</h4>
              </div>
              <div class="time-info display-none">
                <p>Time</p>
                <h4 class="time">${convertDuration(
                  dataArr[item].track.duration_ms
                )}</h4>
              </div>
            </div>
            <div class="actions flex">
              <button>
                <img
                  src="./public/images/heart.svg"
                  class="heart display-none"
                />
              </button>
              <button>
                <img src="./public/images/more-menu-vertical-line.svg" />
              </button>
            </div>
          </div>    
        `;
  }
};

createPlaylist();
