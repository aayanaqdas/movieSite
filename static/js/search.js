// Purpose: Handle search functionality and display search results
import { apiKey, fetchData} from "./api.js";
import {
  createSearchCard,
  createSearchCardTv,
  createSearchCardPerson,
} from "./pageCreators.js";

const searchUrlPerson = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=`;
const searchUrlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const searchUrlTv = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=`;

const form = document.getElementById("searchForm");
const query = document.getElementById("searchInput");

const searchResult = document.getElementById("searchResult");

const loadMovieBtn = document.getElementById("loadMovieBtn");
const loadTvBtn = document.getElementById("loadTvBtn");
const loadPersonBtn = document.getElementById("loadPersonBtn");

//These variables keep track of results loaded in and total results available from api.
//Used in detectEnd function
let totalResultsMovie = 0;
let totalResultsTv = 0;
let totalResultsPerson = 0;
let totalResults = 0;
let currentResultsMovie = 0;
let currentResultsTv = 0;
let currentResultsPerson = 0;

let page = 1;

let searchTerm;

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

// Fetch and show results based on url for searching
async function fetchAndShowSearchMovie(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    console.log(data);
    skeletonContainer.classList.add("hide-element");
    showSearchResults(data.results, "movie");

    totalResultsMovie = data.total_results;
    totalResults += totalResultsMovie;

    currentResultsMovie = data.results.length + currentResultsMovie;

    loadMovieBtn.innerText = `Movies: ${totalResultsMovie}`;
    console.log("current results for movie: " + currentResultsMovie);
    generateSkeletons(10); // Generate skeletons based on current results length
  }
}

async function fetchAndShowSearchTv(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    console.log(data);
    skeletonContainer.classList.add("hide-element");
    showSearchResults(data.results, "tv");

    totalResultsTv = data.total_results;
    totalResults += totalResultsTv;

    currentResultsTv = data.results.length + currentResultsTv;

    loadTvBtn.innerText = `TV Shows: ${totalResultsTv}`;
    console.log("Total results for tv: " + totalResultsTv);
    generateSkeletons(10); // Generate skeletons based on current results length
  }
}

async function fetchAndShowSearchPerson(url) {
  const data = await fetchData(url);
  if (data && data.results) {
    console.log(data);
    skeletonContainer.classList.add("hide-element");
    showSearchResults(data.results, "person");

    totalResultsPerson = data.total_results;
    totalResults += totalResultsPerson;

    currentResultsPerson = data.results.length + currentResultsPerson;

    loadPersonBtn.innerText = `People: ${totalResultsPerson}`;
    console.log("Total results for people: " + totalResultsPerson);
    generateSkeletons(10); // Generate skeletons based on current results length
  }
}

function showSearchResults(item, mediaType) {
  const searchContent = item
    .map((media) => {
      if (mediaType === "movie") {
        if (loadMovieBtn.classList.contains("active")) {
          return createSearchCard(media);
        }
      } else if (mediaType === "tv") {
        if (loadTvBtn.classList.contains("active")) {
          return createSearchCardTv(media);
        }
      } else if (mediaType === "person") {
        if (loadPersonBtn.classList.contains("active")) {
          return createSearchCardPerson(media);
        }
      }
    })
    .join("");

  searchResult.innerHTML += searchContent;
  if (searchResult.innerHTML === "") {
    searchResult.innerHTML += "<p>No results found<p>";
  }
}

// Clear result element for search and reset variables
function clearResults() {
  searchResult.innerHTML = "";
  page = 1;
  query.value = "";
  currentResultsMovie = 0;
  currentResultsTv = 0;
  currentResultsPerson = 0;
}

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const searchTermInput = query.value.trim();
  if (searchTermInput) {
    const urlParams = new URLSearchParams();
    urlParams.set("query", searchTermInput);
    const newUrl = `search.html?${urlParams.toString()}`;

    window.location.href = newUrl;
  }
}

export { handleSearch };

// Load more results
function loadMoreResults() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get("query");
  if (urlQuery) {
    page++;
    const newUrlMovie = `${searchUrlMovie}${searchTerm}&page=${page}`;
    const newUrlTv = `${searchUrlTv}${searchTerm}&page=${page}`;
    const newUrlPerson = `${searchUrlPerson}${searchTerm}&page=${page}`;
    skeletonContainer.classList.remove("hide-element");
    generateSkeletons(10);

    //Fetches more results if only one of the button has the "active" class
    if (loadMovieBtn.classList.contains("active")) {
      fetchAndShowSearchMovie(newUrlMovie);
    } else if (loadTvBtn.classList.contains("active")) {
      fetchAndShowSearchTv(newUrlTv);
    } else if (loadPersonBtn.classList.contains("active")) {
      fetchAndShowSearchPerson(newUrlPerson);
    }
  }
}

// Detect end of page and load more results
function detectEnd() {
  //if results that are loaded in is not the same as the results available from api
  if (
    loadMovieBtn.classList.contains("active") &&
    currentResultsMovie < totalResultsMovie
  ) {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreResults();
    }
  } else if (
    loadTvBtn.classList.contains("active") &&
    currentResultsTv < totalResultsTv
  ) {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreResults();
    }
  } else if (
    loadPersonBtn.classList.contains("active") &&
    currentResultsPerson < totalResultsPerson
  ) {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreResults();
    }
  }
}

// Event listeners
form.addEventListener("submit", handleSearch);

// loadMoreBtn.addEventListener("click", loadMoreResults)
if (window.location.pathname === "/search.html") {
  window.addEventListener("scroll", detectEnd);
  
  loadMovieBtn.addEventListener("click", () => {
    loadMovieBtn.classList.add("active");
    loadTvBtn.classList.remove("active");
    loadPersonBtn.classList.remove("active");
    clearResults();
    fetchAndShowSearchMovie(searchUrlMovie + searchTerm);
  });

  loadTvBtn.addEventListener("click", () => {
    loadTvBtn.classList.add("active");
    loadMovieBtn.classList.remove("active");
    loadPersonBtn.classList.remove("active");
    clearResults();
    fetchAndShowSearchTv(searchUrlTv + searchTerm);
  });

  loadPersonBtn.addEventListener("click", () => {
    loadPersonBtn.classList.add("active");
    loadMovieBtn.classList.remove("active");
    loadTvBtn.classList.remove("active");
    clearResults();
    fetchAndShowSearchPerson(searchUrlPerson + searchTerm);
  });
}

// Initiate search when page loads if query is in url
async function initSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get("query");
  if (urlQuery) {
    query.value = urlQuery;
    searchTerm = urlQuery;
    clearResults();
    skeletonContainer.classList.remove("hide-element");
    generateSkeletons(10); // Generate 10 skeletons initially

    const newUrlMovie = `${searchUrlMovie}${searchTerm}`;
    const newUrlTv = `${searchUrlTv}${searchTerm}`;
    const newUrlPerson = `${searchUrlPerson}${searchTerm}`;
    const resultsText = document.getElementById("resultsText");
    const totalResultsText = document.getElementById("totalResultsText");
    resultsText.innerText = "Search results for: " + searchTerm;
    document.title = `Search: ${searchTerm}`;
    await fetchAndShowSearchMovie(newUrlMovie);
    await fetchAndShowSearchTv(newUrlTv);
    await fetchAndShowSearchPerson(newUrlPerson);
    totalResultsText.innerText = `(Results: ${totalResults})`;
  }
}
initSearch();
