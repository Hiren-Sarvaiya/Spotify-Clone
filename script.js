console.log("script.js is running...");

async function getSongs() {
  let data = await fetch("http://127.0.0.1:3000/songs/");
  let response = await data.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1].replaceAll("%20", " ").replace(".mp3", ""));
    }
  }
  return songs;
}

(async function main() {
  let songs = await getSongs();
  console.log(songs);

  let songOL = document.querySelector(".songList").getElementsByTagName("ol")[0];
  for (const song of songs) {
    songOL.innerHTML += `<li class="flex items-center cur-p">
              <img src="images/music.png" height="48px">
              <div class="info">
                <div class="sName">${song}</div>
                <div class="sArtist">Hiren Sarvaiya</div>
              </div>
              <img src="images/playsong.png" class="playButton" height="30px">
            </li>`;
  }

  let audio = new Audio(songs[0]);
  // audio.play();

  audio.addEventListener("loadeddata", () => {
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  })
})()