
import { toggleSettingsMenu } from "./eventHandlers.js";
import { createMovieCard, createTvCard } from "./pageCreators.js";
import { initWatchlist } from "./watchlist.js";
import { handleSearch } from "./search.js";

// Check if userInfo exists in local storage
if (!localStorage.getItem("userInfo")){
  const userInfoObj = {
    username: "",
    loggedIn: false,
    watchlist: []
  }
  localStorage.setItem("userInfo", JSON.stringify(userInfoObj));
}

const form = document.getElementById("searchForm");

const trendingResult = document.getElementById("trendingSection");
const popularMoviesResult = document.getElementById("popularMoviesSection");
const upcomingMoviesResult = document.getElementById("upcomingSection");
const topRatedTvResult = document.getElementById("topRatedTvSection");

let page = 1;
const dateToday = new Date().toISOString().slice(0, 10);
const language = navigator.languages[0];
const region = navigator.languages[0].substring(3);

async function fetchDetails(type) {
  try {
    const response = await fetch(`home/${type}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data, type);
    showResults(data.results, type);
  } catch (error) {
    console.error("Error fetching media details:", error);
  }
}

function showResults(items, type) {
  let newContent = "";
  if (type === "trendingData") {
    newContent = items
      .map((media) =>
        media.media_type === "movie"
          ? createMovieCard(media)
          : createTvCard(media)
      )
      .join("");
    trendingResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "popularMoviesData") {
    newContent = items.map(createMovieCard).join("");
    popularMoviesResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "topRatedTvData") {
    newContent = items.map(createTvCard).join("");
    topRatedTvResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "upcomingMoviesData") {
    newContent = items.map(createMovieCard).join("");
    upcomingMoviesResult.innerHTML = newContent || "<p>No results found.</p>";
  }

}

async function init() {
  await fetchDetails("trendingData");
  await fetchDetails("popularMoviesData");
  await fetchDetails("topRatedTvData");
  await fetchDetails("upcomingMoviesData");
  initWatchlist();
}

form.addEventListener("submit", handleSearch);

init();
toggleSettingsMenu();
