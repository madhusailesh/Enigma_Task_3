const menuBtn = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");

let menuOpen = false;

menuBtn.addEventListener("click", () => {
  menuOpen = !menuOpen;

  // bat ko X karne kelite
  if (menuOpen) {
    mobileMenu.classList.remove("max-h-0", "pt-0", "pb-0");
mobileMenu.classList.add("max-h-96", "pt-4", "pb-4");

    line1.classList.add("rotate-45", "absolute");
    line2.classList.add("opacity-0");
    line3.classList.add("-rotate-45", "absolute");
  } else {
    mobileMenu.classList.add("max-h-0", "pt-0", "pb-0");
    mobileMenu.classList.remove("max-h-60", "pt-4", "pb-4");

    line1.classList.remove("rotate-45", "absolute");
    line2.classList.remove("opacity-0");
    line3.classList.remove("-rotate-45", "absolute");
  }
});

const cryMap = {
  pikachu:
    "https://dl.prokerala.com/downloads/ringtones/files/mp3/pika-pikachu-14757.mp3",
  charizard: "https://play.pokemonshowdown.com/audio/cries/charizard.mp3",
  bulbasaur: "https://play.pokemonshowdown.com/audio/cries/bulbasaur.mp3",
  squirtle: "https://play.pokemonshowdown.com/audio/cries/squirtle.mp3",
  mewtwo: "https://play.pokemonshowdown.com/audio/cries/mewtwo.mp3",
  eevee: "https://play.pokemonshowdown.com/audio/cries/eevee.mp3",
};

function playCry(pokemon) {
  const audio = new Audio(cryMap[pokemon]);
  audio.play();
}

function playVideo() {
  const videoContainer = document.getElementById("videoContainer");
  const ytVideo = document.getElementById("ytVideo");

  const videoURL =
    "https://www.youtube.com/embed/takWBDNLCVg";
  ytVideo.src = videoURL;
  videoContainer.classList.remove("hidden");
}

function closeVideo() {
  const videoContainer = document.getElementById("videoContainer");
  const ytVideo = document.getElementById("ytVideo");

  ytVideo.src = "";
  videoContainer.classList.add("hidden");
  videoContainer.querySelector("#closeVideoBtn").classList.add("hidden");
}

