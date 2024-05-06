console.log("script.js is running...");
let currentSong = new Audio();
let songs;
let currentFolder;

async function getSongs(folder) {
  currentFolder = folder;
  console.log(currentFolder);
  let data = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await data.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " ").replace(".mp3", ""));
    }
  }
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
    playsong.src = "images/pausesong.png";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songduration").innerHTML = `${getTime(currentSong.currentTime)}/00:00`;
}

const getTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

const updateSongList = () => {
  let songOL = document.querySelector(".songList").getElementsByTagName("ol")[0];
  songOL.innerHTML = "";
  for (const song of songs) {
    songOL.innerHTML += `<li class="flex items-center">
                          <img src="images/music.png" class="music" height="48px">
                          <div class="info">
                            <div class="sName">${song}</div>
                            <div class="sArtist">Hiren Sarvaiya</div>
                          </div>
                          <img src="images/playsong.png" class="playButton cur-p invert1" height="30px">
                        </li>`;
  }
  
  addEventListenerToPlayButton();
}

async function updateCardContainer() {
  let data = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await data.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice("-2")[0];
      let data = await fetch(`http://127.0.0.1:3000/songs/${folder}/folderInfo/info.json`);
      let response = await data.json();

      cardContainer.innerHTML += `<div data-folder="${folder}" class="card cur-p">
                                    <div class="play flex justify-center items-center"><img src="images/play.png"></div>
                                    <img src="songs/${folder}/folderInfo/cover.png" alt="image">
                                    <h2>${response.title}</h2>
                                    <p>${response.description}</p>
                                  </div>`;
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      console.log(songs);
      playMusic(songs[0]);
      updateSongList();
    })
  })
}

const addEventListenerToPlayButton = () => {
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    (e.querySelector(".playButton")).addEventListener("click", () => {
      console.log(e.querySelector(".sName").innerHTML);
      playMusic(e.querySelector(".sName").innerHTML);
    })
  });
}

(async function main() {
  await getSongs("songs/IDK");
  console.log(songs);
  playMusic(songs[0], true);
  updateSongList();
  updateCardContainer();
  
  addEventListenerToPlayButton();

  playsong.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playsong.src = "images/pausesong.png";
    } else {
      currentSong.pause();
      playsong.src = "images/playsong.png";
    }
  })

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songduration").innerHTML = `${getTime(currentSong.currentTime)}/${getTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
  })

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + '%';
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = '0';
  })

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-125%";
  })

  previoussong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replace(".mp3", ""));
    if (songs[index - 1]) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[0]);
    }
  })

  nextsong.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replace(".mp3", ""));
    if (songs[index + 1]) {
      playMusic(songs[index+1]);
    } else {
      playMusic(songs[0]);
    }
  })

  document.querySelector(".rangeInput").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    let volumeBTN = document.querySelector(".volumebtn")
    if (e.target.value == 0) {
      volumeBTN.src = volumeBTN.src.replace("volume", "mute");
    } else {
      volumeBTN.src = volumeBTN.src.replace("mute", "volume");
    }
  })

  document.querySelector(".volumebtn").addEventListener("click", (e) => {
    if (e.target.src.includes("images/volume.png")) {
      e.target.src = "images/mute.png";
      currentSong.volume = 0;
      document.querySelector(".rangeInput").value = 0;
    } else {
      e.target.src = "images/volume.png";
      currentSong.volume = 1;
      
      document.querySelector(".rangeInput").value = 50;
    }
  })
})()