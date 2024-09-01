const apiKey = "37d7e055234a0531d45416a1d56745eb";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=`;

const form = document.getElementById("searchForm");
const query = document.getElementById("searchInput");

const trendingResult = document.getElementById("trendingSection");
const upcomingMoviesResult = document.getElementById("upcomingSection");
const topRatedTvResult = document.getElementById("topRatedTvSection");

const searchResult = document.getElementById("searchResult");
const loadMoreBtn = document.getElementById("loadMoreBtn");
let page = 1;
let isSearching = false;

let searchTerm;

// Fetch JSON data from url
async function fetchTrendingData(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data && data.results) {
      showResults(data.results, "trendingData");
    }
  } catch (error) {
    return null;
  }
}

async function fetchTopRatedTvData(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data && data.results) {
      showResults(data.results, "topRatedTvData");
    }
  } catch (error) {
    return null;
  }
}

async function fetchUpcomingData(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data && data.results) {
      showResults(data.results, "upcomingMoviesData");
    }
  } catch (error) {
    return null;
  }
}

async function fetchTrendingAll(url) {
  await fetchTrendingData(url);
}

async function fetchTopRatedTv(url) {
  await fetchTopRatedTvData(url);
}

async function fetchUpcomingMovies(url) {
  await fetchUpcomingData(url);
}

// Show results in page
function showResults(items, type) {
  if (type === "trendingData") {
    const newContent = items
      .map((media) => {
        if (media.media_type === "movie") {
          return createMovieCard(media);
        } else if (media.media_type === "tv") {
          return createTvCard(media);
        }
      })
      .join("");
    trendingResult.innerHTML += newContent || "<p>No results found.</p>";
  } else if (type === "topRatedTvData") {
    const newContent = items.map(createTvCard).join("");
    topRatedTvResult.innerHTML += newContent || "<p>No results found.</p>";
  } else if (type === "upcomingMoviesData") {
    const newContent = items.map(createMovieCard).join("");
    upcomingMoviesResult.innerHTML += newContent || "<p>No results found.</p>";
  }
}

// Create movie card html template
function createMovieCard(movie) {
  const {
    backdrop_path,
    poster_path,
    original_title,
    release_date,
    overview,
    id,
    media_type,
  } = movie;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  const cardTemplate = `
              <div class="movie-card card" data-id="${id}">
              <img src="${imagePath}" alt="" />
            </div>
    `;

  console.log(media_type);
  return cardTemplate;
}

// Create tv-show card html template
function createTvCard(tv) {
  const {
    backdrop_path,
    poster_path,
    original_name,
    first_air_date,
    overview,
    id,
    media_type,
  } = tv;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  const cardTemplate = `
            <div class="tv-card card" data-id="${id}">
              <span class="tv-label">TV</span>
              <img src="${imagePath}" alt="" />
            </div>

    `;
  console.log(media_type);
  return cardTemplate;
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
  }
}

// Fetch and show results based on url for searching
async function fetchAndShowSearch(url) {
  const data = await fetchDataSearch(url);
  if (data && data.results) {
    showSearchResults(data.results);
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

  /*Check if "No results found" already exists so it doesnt show multiple times*/
  if (searchContent == "") {
    if (!searchResult.innerHTML.includes("No results found.")) {
      searchResult.innerHTML += "<p>No results found.</p>";
    }
  } else {
    searchResult.innerHTML += searchContent;
  }
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
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  const searchTitle =
    original_title.length > 25
      ? original_title.slice(0, 25) + "..."
      : original_title;
  const formattedDate =
    release_date.length > 4
      ? release_date.slice(0, 4)
      : release_date || "No release date";
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
      return genre ? genre.name : "";
    })
    .join(", ");

  const cardTemplate = `
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
      `;
  console.log(media_type);
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
  const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

  const searchTitle =
    original_name.length > 31
      ? original_name.slice(0, 29) + "..."
      : original_name;
  const formattedDate =
    first_air_date.length > 4
      ? first_air_date.slice(0, 4)
      : first_air_date || "No release date";
  const year = formattedDate.slice(0, 4);
  const escapedOverview = overview.replace(/['"]/g, "&apos;");
  const description =
    escapedOverview.length > 110
      ? escapedOverview.slice(0, 110) + "... "
      : escapedOverview;

  // Get genre_id from api and Map genre IDs to their names which is located in genres.js
  const genreNames = genre_ids
    .map((genreId) => {
      const genre = tvGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "";
    })
    .join(", ");

  const cardTemplate = `
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

`;
  console.log(media_type);
  return cardTemplate;
}

// Clear result element for search
function clearResults() {
  trendingResult.innerHTML = "";
  topRatedTvResult.innerHTML = "";
  upcomingMoviesResult.innerHTML = "";
  searchResult.innerHTML = "";
  page = 1;
}

// Handle search
async function handleSearch(e) {
  e.preventDefault();
  const searchTermInput = query.value.trim();

  if (searchTermInput) {
    isSearching = true;
    clearResults();
    searchTerm = searchTermInput;

    const newUrl = `${searchUrl}${searchTerm}`;
    const sectionHeadline = document.querySelectorAll(".sectionHeadline");
    sectionHeadline.forEach((headline) => {
      headline.classList.add("hide-element");
    });
    const resultsText = document.getElementById("resultsText");
    trendingResult.classList.add("hide-element");
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
      fetchAndShowSearch(newUrl);
    }
  }
}

// Detect end of page and load more results
function detectEnd() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMoreResults();
  }
}

// Event listeners
form.addEventListener("submit", handleSearch);
// loadMoreBtn.addEventListener("click", loadMoreResults)
window.addEventListener("scroll", detectEnd);
window.addEventListener("resize", detectEnd);

// Initialize the page
async function init() {
  clearResults();
  isSearching = false;

  const trendingAllUrl = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}&page=${page}`;
  await fetchTrendingAll(trendingAllUrl);

  const topRatedTvUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&api_key=${apiKey}&page=${page}`;
  await fetchTopRatedTv(topRatedTvUrl);

  const upcomingMoviesUrl = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&api_key=${apiKey}&page=${page}`;
  await fetchUpcomingMovies(upcomingMoviesUrl);
}

init();
