// =================== SELECT ELEMENTS ===================
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const progressBar = document.querySelector(".progress-bar");
const currTime = document.querySelector(".curr-time");
const totTime = document.querySelector(".tot-time");
const volumeBar = document.querySelector(".sound-bar");

const songTitleEl = document.querySelector(".song-title");
const songArtistEl = document.querySelector(".song-artist");
const albumImgEl = document.querySelector(".album-img");
const cardElements = document.querySelectorAll(".play-song");
const likeIcon = document.querySelector(".album-icons.fa-heart");
const saveIcon = document.querySelector(".album-icons.fa-bookmark");
const searchInput = document.querySelector(".search-input");

// Cache for optimized search & delegation
let cardElementsCache = [];
let searchableData = [];
const cardsContainer = document.querySelector(".main-content"); // Container for event delegation

// =================== DATA ===================
const songs = [
  //start
  {
    title: "Zinda Banda",
    artist: "Anirudh",
    src: "./songs/Zinda Banda.mp3",
    cover: "./assets/album.jpg"
  },

  //jab tak hai jaan
  {
    title: "Saans",
    artist: "Shreya Ghoshal, Mohit Chauhan",
    src: "./songs/Saans.mp3",
    cover: "./assets/songposter2.webp"
  },
  {
    title: "Challa",
    artist: "Rabbi Shergill",
    src: "./songs/Challa.mp3",
    cover: "./assets/songposter2.webp"
  },
  {
    title: "Ishq Shava",
    artist: "Raghav, Shilpa Rao",
    src: "./songs/Ishq Shava.mp3",
    cover: "./assets/songposter2.webp"
  },
  {
    title: "Jab Tak Hai Jaan",
    artist: "Javed Ali, Shakthisree Gopalan",
    src: "./songs/Jab Tak Hai Jaan.mp3",
    cover: "./assets/songposter2.webp"
  },
  {
    title: "JTHJ- The Poem Shah Rukh Khan",
    artist: "Shah Rukh Khan",
    src: "./songs/Jab Tak Hai Jaan_ The Poem Shah Rukh Khan.mp3",
    cover: "./assets/songposter2.webp"
  },
  {
    title: "Jiya Re",
    artist: "Neeti Mohan",
    src: "./songs/Jiya Re.mp3",
    cover: "./assets/songposter2.webp"
  },
  //chennai express
  {
    title: "Titli",
    artist: "Chinmayi Sripada, Gopi Sunder",
    src: "./songs/Titli.mp3",
    cover: "./assets/songposter6.jpg"
  },
  {
    title: "1234",
    artist: "Vishal Dadlani, Hamsika Iyer",
    src: "./songs/1234.mp3",
    cover: "./assets/songposter6.jpg"
  },
  {
    title: "Tera Rastaa Chhodoon na",
    artist: "Amitabh Bhattacharya, Anusha Mani",
    src: "./songs/Tera Rastaa.mp3",
    cover: "./assets/songposter6.jpg"
  },
  {
    title: "Lungi Dance",
    artist: "Yo Yo Honey Singh",
    src: "./songs/Lungi Dance.mp3",
    cover: "./assets/songposter6.jpg"
  },
  {
    title: "Kashmir Mai Tu KanyaKumari",
    artist: "Arijit Singh, Neeti Mohan",
    src: "./songs/Kashmir Main Tu Kanyakumari.mp3",
    cover: "./assets/songposter6.jpg"
  },
  // arijit
  {
    title: "Zaalima",
    artist: "Arijit Singh, Harshdeep Kaur",
    src: "./songs/Zaalima.mp3",
    cover: "./assets/arjits.jpg"
  },
  {
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    src: "./songs/Tum Hi Ho.mp3",
    cover: "./assets/arjits.jpg"
  },
  {
    title: "Ik Vaari aa",
    artist: "Arijit Singh",
    src: "./songs/Ik Vaari aa.mp3",
    cover: "./assets/arjits.jpg"
  },
  {
    title: "Gerua",
    artist: "Arijit Singh, Antara Mitra",
    src: "./songs/Gerua.mp3",
    cover: "./assets/arjits.jpg"
  },
  {
    title: "Rait Zara Si",
    artist: "Arijit Singh, Shashwat Singh",
    src: "./songs/Rait Zara Si.mp3",
    cover: "./assets/arjits.jpg"
  },
  //rockstar
  {
    title: "Tum Ho",
    artist: "Mohit Chauhan",
    src: "./songs/Tum Ho.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Tum Ko",
    artist: "Kavita Krishnamurthy",
    src: "./songs/Tum Ko.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Katiya Karun",
    artist: "Harshdeep Kaur",
    src: "./songs/Katiya Karun.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Sheher Mein",
    artist: "Mohit Chauhan, Karthik",
    src: "./songs/Sheher Mein.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Saadda Haq",
    artist: "ARR, Mohit Chauhan",
    src: "./songs/Saadda Haq.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Phir Se Ud Chala",
    artist: "ARR, Mohit Chauhan",
    src: "./songs/Phir Se Ud.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Kun Faaya Kun",
    artist: "A.R. Rahman, Javed Ali, Mohit Chauhan",
    src: "./songs/Kun Faaya Kun.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Haawa Haawa",
    artist: "ARR, Mohit Chauhan",
    src: "./songs/Haawa Haawa.mp3",
    cover: "./assets/rockstar.jpg"
  },
  {
    title: "Jo Bhi Main",
    artist: "ARR, Mohit Chauhan",
    src: "./songs/Jo Bhi Main.mp3",
    cover: "./assets/rockstar.jpg"
  },
  //gym
  {
    title: "Zinda",
    artist: "Siddharth Mahadevan",
    src: "./songs/zinda.mp3",
    cover: "./assets/songposter5.jpg"
  },
  {
    title: "Sultan",
    artist: "Sukhwinder Singh",
    src: "./songs/Sultan.mp3",
    cover: "./assets/songposter5.jpg"
  },

  //Marathi
  {
    title: "Rani Majhya Malyamandi",
    artist: "Anand Shinde",
    src: "./songs/Rani Majhya Malyamandi.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Aatach Baya Ka Baavarla",
    artist: "Shreya Ghoshal",
    src: "./songs/Aatach Baya Ka Baavarla.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Mazi Rambha Ga Rambha",
    artist: "Anand Shinde",
    src: "./songs/Mazi Rambha Ga Rambha.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Sairat Jhala Ji",
    artist: "Ajay Gogavale, Chinmayi Sripada",
    src: "./songs/Sairat Jhala Ji.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Yad Lagla",
    artist: "Ajay Gogavale",
    src: "./songs/Yad Lagla.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Zingaat",
    artist: "Ajay-Atul",
    src: "./songs/Zingaat.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Wajle Ki Bara",
    artist: "Bela Shende",
    src: "./songs/Wajle Ki Bara.mp3",
    cover: "./assets/Sairat.jpg"
  },
  {
    title: "Un Un vhatat",
    artist: "Avadhoot Gupte, Vaishali Made",
    src: "./songs/Un Un vhatat.mp3",
    cover: "./assets/Sairat.jpg"
  },
  //Kabir Singh  
  {
    title: "Pehla Pyaar",
    artist: "Armaan Malik",
    src: "./songs/Pehla Pyaar.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  {
    title: "Bekhayali",
    artist: "Sachet Tandon",
    src: "./songs/Bekhayali.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  {
    title: "Kaise Hua",
    artist: "Sachet Tandon",
    src: "./songs/Kaise Hua.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  {
    title: "Mere Sohneya",
    artist: "Sachet Tandon, Parampara Thakur",
    src: "./songs/Mere Sohneya.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  {
    title: "Tujhe Kitna Chahne Lage",
    artist: "Arijit Singh",
    src: "./songs/Tujhe Kitna Chahne Lage.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  {
    title: "Tera Ban Jaunga",
    artist: "Akhil Sachdeva, Tulsi Kumar",
    src: "./songs/Tera Ban Jaunga.mp3",
    cover: "./assets/Kabir-Singh.jpg"
  },
  //english
  {
    title: "End Of Beginning",
    artist: "Djo",
    src: "./songs/End_Of_Beginning.mp3",
    cover: "./assets/english.jpg"
  },
  {
    title: "Can't Help Falling in Love",
    artist: "Matthew Field",
    src: "./songs/Can't Help Falling in Love.mp3",
    cover: "./assets/english.jpg"
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    src: "./songs/Until I Found You.mp3",
    cover: "./assets/english.jpg"
  },
  //thalapathy
  {
    title: "Badass",
    artist: "Anirudh Ravichander",
    src: "./songs/Badass.mp3",
    cover: "./assets/badass.jpg"
  },
  {
    title: "Naa Ready",
    artist: "Anirudh Ravichander, Thalapathy Vijay",
    src: "./songs/Naa-Ready.mp3",
    cover: "./assets/badass.jpg"
  },
  {
    title: "Appadi Podu",
    artist: "KK, Anuradha Sriram",
    src: "./songs/Appadi_Podu.mp3",
    cover: "./assets/badass.jpg"
  },
  //romance
  {
    title: "O Meri Laila",
    artist: "Atif Aslam, Jyotica Tangri",
    src: "./songs/O Meri Laila.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Tere Naina",
    artist: "Shankar Mahadevan, Shreya Ghoshal",
    src: "./songs/Tere Naina.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Tere Bina",
    artist: "A.R. Rahman, Chinmayi",
    src: "./songs/Tere Bina.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Tum Tak",
    artist: "Javed Ali",
    src: "./songs/Tum Tak.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Ay Hairathe",
    artist: "Hariharan, Alka Yagnik",
    src: "./songs/Ay Hairathe.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Kya Yahi Pyar Hai",
    artist: "K.K., Alka Yagnik",
    src: "./songs/Kya Yahi Pyar Hai.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Chaiyya Chaiyya",
    artist: "Sukhwinder Singh",
    src: "./songs/Chaiyya Chaiyya.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Saibo",
    artist: "Shreya Ghoshal",
    src: "./songs/Saibo.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Bulleya",
    artist: "Amit Mishra, Shilpa Rao",
    src: "./songs/Bulleya.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Daayre",
    artist: "Arijit Singh",
    src: "./songs/Daayre.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Maahi Ve Highway",
    artist: "A.R. Rahman",
    src: "./songs/Maahi Ve Highway.mp3",
    cover: "./assets/srk.jpg"
  },
  {
    title: "Choo Lo",
    artist: "The Local Train",
    src: "./songs/Choo Lo.mp3",
    cover: "./assets/choo lo.jpg"
  }
];

let currentSongIndex = localStorage.getItem("currentSongIndex") ? parseInt(localStorage.getItem("currentSongIndex")) : 0;
let isPlaying = false;
let activePlaylist = []; // Array of song indices
let activePlaylistIndex = 0; // Index within the activePlaylist array
let isPlaylistActive = false;
let savedSongs = JSON.parse(localStorage.getItem("savedSongs")) || []; // Initialize from Storage

const posterPlaylists = {
  english: [42, 43, 44],
  kabir_singh: [36, 37, 38, 39, 40, 41],
  chennai_express: [7, 8, 9, 10, 11],
  romance: [48, 49, 50, 51, 52, 53, 54, 55, 56, 58],
  gym: [26, 27],
  rockstar: [17, 18, 19, 20, 21, 22, 23, 24, 25],
  choo_lo: [59],
  marathi: [28, 29, 30, 31, 32, 33, 34, 35],
  thalapathy: [45, 46, 47],
  arijit: [12, 13, 14, 15, 16],
  jab_tak_hai_jaan: [1, 2, 3, 4, 5, 6]
};

// =================== FUNCTIONS ===================

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  songTitleEl.innerText = song.title;
  songArtistEl.innerText = song.artist;
  albumImgEl.src = song.cover;
  localStorage.setItem("currentSongIndex", index);

  // Update Save Icon State
  if (savedSongs.includes(index)) {
    saveIcon.classList.add("saved", "fa-solid");
    saveIcon.classList.remove("fa-regular");
  } else {
    saveIcon.classList.remove("saved", "fa-solid");
    saveIcon.classList.add("fa-regular");
  }
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.classList.replace("fa-circle-play", "fa-circle-pause");
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.classList.replace("fa-circle-pause", "fa-circle-play");
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function formatTime(time) {
  if (isNaN(time)) return "00:00";
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

// =================== EVENT LISTENERS ===================

// Play Button Click
playBtn.addEventListener("click", togglePlay);

// Update Progress Bar & Time (Optimized: Throttle to once per second)
let lastSecond = -1;
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const currentSecond = Math.floor(audio.currentTime);

    // Always update progress bar visual (for smoothness)
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    progressBar.style.setProperty("--progress", `${progress}%`);

    // Only update text labels if the second has changed (Saves DOM operations)
    if (currentSecond !== lastSecond) {
      lastSecond = currentSecond;
      currTime.innerText = formatTime(audio.currentTime);
      totTime.innerText = formatTime(audio.duration);
    }
  }
});

// Seek
progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Volume Control
volumeBar.addEventListener("input", () => {
  const vol = volumeBar.value;
  audio.volume = vol / 100;
  volumeBar.style.setProperty("--volume", `${vol}%`);
  localStorage.setItem("volume", vol);
});

// Song Ended -> Next Song
audio.addEventListener("ended", () => {
  nextSong();
});

// OPTIMIZED: Event Delegation (One listener for all cards instead of many)
if (cardsContainer) {
  cardsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".play-song");
    if (!card) return;

    const playlistKey = card.getAttribute("data-playlist");
    if (playlistKey && (posterPlaylists[playlistKey] || playlistKey === 'saved')) {
      startPlaylist(playlistKey);
      return;
    }

    const index = card.getAttribute("data-index");
    if (index !== null) {
      isPlaylistActive = false;
      activePlaylist = [];
      currentSongIndex = parseInt(index);
      loadSong(currentSongIndex);
      playSong();
    }
  });
}

function startPlaylist(key) {
  isPlaylistActive = true;

  if (key === 'saved') {
    activePlaylist = savedSongs;
  } else {
    activePlaylist = posterPlaylists[key];
  }

  activePlaylistIndex = 0;

  if (activePlaylist.length > 0) {
    currentSongIndex = activePlaylist[activePlaylistIndex];
    loadSong(currentSongIndex);
    playSong();
  }
}

function nextSong() {
  if (isPlaylistActive && activePlaylist.length > 0) {
    activePlaylistIndex = (activePlaylistIndex + 1) % activePlaylist.length;
    currentSongIndex = activePlaylist[activePlaylistIndex];
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

function prevSong() {
  if (isPlaylistActive && activePlaylist.length > 0) {
    activePlaylistIndex = (activePlaylistIndex - 1 + activePlaylist.length) % activePlaylist.length;
    currentSongIndex = activePlaylist[activePlaylistIndex];
  } else {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentSongIndex);
  if (isPlaying) playSong();
}

const forwardBtn = document.querySelector(".fa-forward-step");
const backwardBtn = document.querySelector(".fa-backward-step");

if (forwardBtn) {
  forwardBtn.addEventListener("click", nextSong);
}

if (backwardBtn) {
  backwardBtn.addEventListener("click", prevSong);
}

// =================== ICON INTERACTIONS ===================
if (likeIcon) {
  likeIcon.addEventListener("click", () => {
    likeIcon.classList.toggle("fa-regular");
    likeIcon.classList.toggle("fa-solid");
    likeIcon.classList.toggle("liked");
  });
}

if (saveIcon) {
  saveIcon.addEventListener("click", () => {
    saveIcon.classList.toggle("fa-regular");
    saveIcon.classList.toggle("fa-solid");
    saveIcon.classList.toggle("saved");

    if (savedSongs.includes(currentSongIndex)) {
      // Remove
      savedSongs = savedSongs.filter(id => id !== currentSongIndex);
    } else {
      // Add
      savedSongs.push(currentSongIndex);
    }
    localStorage.setItem("savedSongs", JSON.stringify(savedSongs));
  });
}

// =================== INITIALIZATION ===================
loadSong(currentSongIndex);
const savedVol = localStorage.getItem("volume") ? parseInt(localStorage.getItem("volume")) : 70;
audio.volume = savedVol / 100;
volumeBar.value = savedVol;
volumeBar.style.setProperty("--volume", `${savedVol}%`);

// OPTIMIZED: Initialize search cache
function initSearchCache() {
  cardElementsCache = Array.from(document.querySelectorAll(".card"));
  searchableData = cardElementsCache.map(card => ({
    title: card.querySelector(".card-title")?.innerText.toLowerCase() || "",
    info: card.querySelector(".card-info")?.innerText.toLowerCase() || "",
    element: card
  }));
}
initSearchCache();

const alerts = {
  12: "Do You Have Money?",
  91: "We Don't have that much database for Songs",
  90: "You are not allowed to use this",
  124: "Enjoy without installing"
};

Object.keys(alerts).forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", () => {
      alert(alerts[id]);
    });
  }
});

// Search Functionality (OPTIMIZED: Uses cache and class-toggling)
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    searchableData.forEach(item => {
      if (item.title.includes(query) || item.info.includes(query) || query === "") {
        item.element.classList.remove("hidden-card");
      } else {
        item.element.classList.add("hidden-card");
      }
    });
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.toLowerCase().trim();
      const foundIndex = songs.findIndex(song => song.title.toLowerCase().includes(query));
      if (foundIndex !== -1) {
        activePlaylist = [];
        isPlaylistActive = false;
        currentSongIndex = foundIndex;
        loadSong(currentSongIndex);
        playSong();
      }
    }
  });
}
