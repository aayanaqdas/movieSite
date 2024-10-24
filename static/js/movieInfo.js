import { apiKey, fetchData } from "./api.js";
import {
  createInfoPageMovie,
  createInfoPageTv,
  createInfoPagePerson,
  createCreditsPageMovie,
  createCreditsPageTv,
} from "./pageCreators.js";
import { initYouTubeVideos, toggleSearchBar } from "./eventHandlers.js";
import { handleSearch } from "./search.js";

const infoSectionContainer = document.getElementById("info-section-container");
const loader = document.getElementById("loader");

const form = document.getElementById("searchForm");

async function fetchAndShowResults(mediaId, type) {
  try {
    const response = await fetch(`info/${type}/${mediaId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data, type);
    showResults(data, type);
  } catch (error) {
    console.error("Error fetching media details:", error);
  }
}

//Create the correct page based on the mediaType
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
  } else if (mediaType === "movie/credits") {
    const infoContent = createCreditsPageMovie(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  } else if (mediaType === "tv/credits") {
    const infoContent = createCreditsPageTv(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
    loader.classList.add("hide-element");
  }
}

//get media ID and mediaType from the url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const mediaType = urlParams.get("mediaType");

//get info from api requests
async function initInfoPage(mediaType, id) {
  if (mediaType === "tv") {
    const tvId = id;
    await fetchAndShowResults(tvId, "tv");
  } else if (mediaType === "movie") {
    const movieId = id;
    await fetchAndShowResults(movieId, "movie");
  } else if (mediaType === "person") {
    const personId = id;
    await fetchAndShowResults(personId, "person");
  }

  //get full media credits for cast and crew
  else if (mediaType === "movie/credits") {
    const creditsId = id;
    await fetchAndShowResults(creditsId, "movie/credits");
  } else if (mediaType === "tv/credits") {
    const creditsId = id;
    await fetchAndShowResults(creditsId, "tv/credits");
  }
  initYouTubeVideos();
}
toggleSearchBar();
initInfoPage(mediaType, id);

form.addEventListener("submit", handleSearch);

