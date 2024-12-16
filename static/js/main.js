
import { toggleSettingsMenu } from "./eventHandlers.js";
import { createMovieCard, createTvCard } from "./pageCreators.js";
import { initWatchlist } from "./watchlist.js";
import { handleSearch } from "./search.js";

// Check if userInfo exists in local storage
if (!localStorage.getItem("userInfo")){
  // create userInfo object and set it to local storage
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

// let page = 1;
// const dateToday = new Date().toISOString().slice(0, 10);
// const language = navigator.languages[0];
// const region = navigator.languages[0].substring(3);


// fucntion to fetch media details from backend based on type (trending, popular, top rated, upcoming)
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

// function to display fetched results based on type
function showResults(items, type) {
  let newContent = "";

  // checks if type is trending and creates the card based on media type
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

// function to initialize the page by fetching details based on types then fetches users watchlist after all elements are loaded in
async function init() {
  await fetchDetails("trendingData");
  await fetchDetails("popularMoviesData");
  await fetchDetails("topRatedTvData");
  await fetchDetails("upcomingMoviesData");
  initWatchlist();
}

// event listeners to allow search on the page
form.addEventListener("submit", handleSearch);

// event listener to toggle settings menu
toggleSettingsMenu();

// initialize the page
init();

