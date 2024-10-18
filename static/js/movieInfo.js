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

async function fetchAndShowResults(url, mediaType) {
  const data = await fetchData(url);
  if (data) {
    showResults(data, mediaType);
    console.log(data);
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
async function initInfoPage(id, mediaType) {
  if (mediaType === "tv") {
    const tvInfoUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=aggregate_credits,videos,recommendations,watch/providers`;
    await fetchAndShowResults(tvInfoUrl, "tv");
  } else if (mediaType === "movie") {
    const movieInfoUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos,recommendations,watch/providers`;
    await fetchAndShowResults(movieInfoUrl, "movie");
  } else if (mediaType === "person") {
    const personInfoUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits`;
    await fetchAndShowResults(personInfoUrl, "person");
  }

  //get full media credits for cast and crew
  else if (mediaType === "movie/credits") {
    const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
    await fetchAndShowResults(creditsUrl, "movie/credits");
  } else if (mediaType === "tv/credits") {
    const creditsUrl = `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${apiKey}`;
    await fetchAndShowResults(creditsUrl, "tv/credits");
  }
  initYouTubeVideos();
}
toggleSearchBar();
initInfoPage(id, mediaType);

form.addEventListener("submit", handleSearch);
