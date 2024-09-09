import { apiKey, imgApi } from "./main.js";

const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=`;

const form = document.getElementById("searchForm");
const query = document.getElementById("searchInput");

const trendingResult = document.getElementById("trendingSection");
const popularMoviesResult = document.getElementById("popularMoviesSection");
const upcomingMoviesResult = document.getElementById("upcomingSection");
const topRatedTvResult = document.getElementById("topRatedTvSection");

const searchResult = document.getElementById("searchResult");
const loadMoreBtn = document.getElementById("loadMoreBtn");
let page = 1;
let isSearching = false;

let searchTerm;

let currentResultsLength = 0;
let totalResultsCount = 0;
let totalSearchResults;

const skeletonContainer = document.getElementById("search-skeleton-container");

// Function to generate skeletons
function generateSkeletons(numSkeletons) {
  // Clear existing skeletons
  skeletonContainer.innerHTML = "";

  for (let i = 0; i < numSkeletons; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-search-card", "skeleton");
    skeleton.innerHTML = `
      <div class="skeleton-search-img"></div>
      <div class="skeleton-search-text">
        <h3 class="skeleton-search-title"></h3>
        <p class="skeleton-search-paragraph"></p>
        <p class="skeleton-search-paragraph"></p>
      </div>
    `;
    skeletonContainer.appendChild(skeleton);
  }
}

/***********Searching************/
// Fetch JSON data from url
async function fetchDataSearch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    // Display an error message to the user
    searchResult.innerHTML =
      "<p>Error fetching data. Please try again later.</p>";
    searchSkeleton.classList.add("hide-element");
  }
}

// Fetch and show results based on url for searching
async function fetchAndShowSearch(url) {
  const data = await fetchDataSearch(url);
  if (data && data.results) {
    skeletonContainer.classList.add("hide-element");
    showSearchResults(data.results);

    //keeps track of how many results are available and how many results are currently loaded in
    totalSearchResults = data.total_results;
    currentResultsLength = data.results.length;
    totalResultsCount += currentResultsLength;

    console.log(totalSearchResults);
    generateSkeletons(10); // Generate skeletons based on current results length
  }
}

function showSearchResults(item) {
  const searchContent = item
    .map((media) => {
      if (media.media_type === "movie") {
        return createSearchCard(media);
      } else if (media.media_type === "tv") {
        return createSearchCardTv(media);
      }
    })
    .join("");

  searchResult.innerHTML += searchContent || "<p>No results found<p>";
}

/******Importing genres from genres.js ******/
import { movieGenres, tvGenres } from "./genres.js";

function createSearchCard(movie) {
  const {
    backdrop_path,
    poster_path,
    original_title,
    release_date,
    overview,
    id,
    media_type,
    genre_ids,
  } = movie;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const searchTitle =
    original_title.length > 25
      ? original_title.slice(0, 25) + "..."
      : original_title;
  const formattedDate =
    release_date.length > 4 ? release_date.slice(0, 4) : release_date || "N/A";
  const year = formattedDate.slice(0, 4);
  const escapedOverview = overview.replace(/['"]/g, "&apos;");
  const description =
    escapedOverview.length > 110
      ? escapedOverview.slice(0, 110) + "... "
      : escapedOverview;

  // Get genre_ids from api and Map genre IDs to their names which is located in genres.js
  const genreNames = genre_ids
    .map((genreId) => {
      const genre = movieGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const cardTemplate = `
    <a href="info.html">
              <div class="search-card" data-id="${id}">
                <img src="${imagePath}" alt="" />
                <div class="search-card-text">
                  <h3 class="search-card-title">${searchTitle}</h3>
                  <p class="search-card-info">${year} ${"‧ " + genreNames}</p>
                  <p class="search-card-overview">
                      ${description}
                  </p>
                </div>
              </div>
  
    </a>

        `;

  return cardTemplate;
}

function createSearchCardTv(tv) {
  const {
    backdrop_path,
    poster_path,
    original_name,
    first_air_date,
    overview,
    id,
    media_type,
    genre_ids,
  } = tv;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const searchTitle =
    original_name.length > 31
      ? original_name.slice(0, 29) + "..."
      : original_name;
  const formattedDate =
    first_air_date.length > 4
      ? first_air_date.slice(0, 4)
      : first_air_date || "N/A";
  const year = formattedDate.slice(0, 4);
  const escapedOverview = overview.replace(/['"]/g, "&apos;");
  const description =
    escapedOverview.length > 110
      ? escapedOverview.slice(0, 110) + "... "
      : escapedOverview;

  // Get genre_id from api and Map genre IDs to their names which are located in genres.js
  const genreNames = genre_ids
    .map((genreId) => {
      const genre = tvGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "";
    })
    .join(", ");

  const cardTemplate = `

    <a href="info.html">

    <div class="search-card" data-id="${id}">
  <span class="tv-label">TV</span>
    <img src="${imagePath}" alt="" />
    <div class="search-card-text">
      <h3 class="search-card-title">${searchTitle}</h3>
      <p class="search-card-info">${year} ${"‧ " + genreNames}</p>
      <p class="search-card-overview">
          ${description}
      </p>
    </div>
  </div>
  
</a>

  
  `;

  return cardTemplate;
}

// Clear result element for search and reset variables
function clearResults() {
  searchResult.innerHTML = "";
  trendingResult.innerHTML = "";
  topRatedTvResult.innerHTML = "";
  upcomingMoviesResult.innerHTML = "";
  page = 1;
  totalResultsCount = 0;
}

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const searchTermInput = query.value.trim();

  if (searchTermInput) {
    isSearching = true;
    clearResults();
    skeletonContainer.classList.remove("hide-element");
    generateSkeletons(10); // Generate 10 skeletons initially
    searchTerm = searchTermInput;
    const newUrl = `${searchUrl}${searchTerm}`;
    const sectionHeadline = document.querySelectorAll(".sectionHeadline");
    sectionHeadline.forEach((headline) => {
      headline.classList.add("hide-element");
    });
    const resultsText = document.getElementById("resultsText");

    trendingResult.classList.add("hide-element");
    popularMoviesResult.classList.add("hide-element");
    topRatedTvResult.classList.add("hide-element");
    upcomingMoviesResult.classList.add("hide-element");

    searchResult.classList.remove("hide-element");
    // loadMoreBtn.classList.remove("hide-element");
    resultsText.classList.remove("hide-element");
    resultsText.innerText = "Showing results for: " + query.value;
    query.value = "";

    await fetchAndShowSearch(newUrl);
  }
}

// Load more results
function loadMoreResults() {
  if (isSearching) {
    if (searchTerm) {
      page++;
      const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
      skeletonContainer.classList.remove("hide-element");
      generateSkeletons(currentResultsLength); // Generate 10 skeletons initially
      fetchAndShowSearch(newUrl);
    }
  }
}

// Detect end of page and load more results
function detectEnd() {
  //if results that are loaded in is not the same as the results available from api
  if (totalResultsCount != totalSearchResults) {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreResults();
    }
  }
}

// Event listeners
form.addEventListener("submit", handleSearch);
// loadMoreBtn.addEventListener("click", loadMoreResults)
window.addEventListener("scroll", detectEnd);
