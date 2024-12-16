import {
  createInfoPageMovie,
  createInfoPageTv,
  createInfoPagePerson,
  createCreditsPageMovie,
  createCreditsPageTv,
} from "./pageCreators.js";
import { initYouTubeVideos, toggleSettingsMenu } from "./eventHandlers.js";
import { initWatchlist } from "./watchlist.js";
import { handleSearch } from "./search.js";

const infoSectionContainer = document.getElementById("info-section-container");
const loader = document.getElementById("loader");

const form = document.getElementById("searchForm");

// Function to fetch and display media details based on media type (movie or tv) and ID
async function fetchAndShowResults(mediaType, mediaId) {
  try {
    const response = await fetch(`/info/${mediaType}/${mediaId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const data = await response.json();
      console.log(data, mediaType);
      showResults(data, mediaType);

  } catch (error) {
    loader.classList.add("hide-element");
    infoSectionContainer.innerHTML = "<p>Media not found<p>";
    console.error("Error fetching media details:", error);
  }
}

//Create the correct page based on the mediaType. item is the fetched data containing the details.
function showResults(item, mediaType) {
  if (mediaType === "movie") {
    const infoContent = createInfoPageMovie(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  } else if (mediaType === "tv") {
    const infoContent = createInfoPageTv(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  } else if (mediaType === "person") {
    const infoContent = createInfoPagePerson(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  } else if (mediaType === "movie-credits") {
    const infoContent = createCreditsPageMovie(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  } else if (mediaType === "tv-credits") {
    const infoContent = createCreditsPageTv(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  }
}

const windowUrl = new URL(window.location.href);
const splitUrl = windowUrl.pathname.split("/");
const mediaType = splitUrl[2];
const id = splitUrl[3];

// initialize the page by sending a fetch request to the server with the mediaType and id
async function initInfoPage(mediaType, id) {
  if (mediaType === "tv") {
    const tvId = id;
    await fetchAndShowResults(mediaType, tvId);
  } else if (mediaType === "movie") {
    const movieId = id;
    await fetchAndShowResults(mediaType, movieId);
  } else if (mediaType === "person") {
    const personId = id;
    await fetchAndShowResults(mediaType, personId);
  }
  //get full media credits for cast and crew
  else if (mediaType === "movie-credits") {
    const creditsId = id;
    await fetchAndShowResults(mediaType, creditsId);
  } else if (mediaType === "tv-credits") {
    const creditsId = id;
    await fetchAndShowResults(mediaType, creditsId);
  }
  // Initialize the YouTube videos and watchlist
  initYouTubeVideos();
  initWatchlist(); // need it for knowing if the media is in the watchlist and to add/remove it
}

// Initialize the settings menu toggle functionality
toggleSettingsMenu();

// Initialize the info page
initInfoPage(mediaType, id);

// Add event listener to the search form
form.addEventListener("submit", handleSearch);

