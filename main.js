
const apiKey = "37d7e055234a0531d45416a1d56745eb";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=`;

const form = document.getElementById("searchForm");
const query = document.getElementById("searchInput");
const movieResult = document.getElementById("movies");
const tvResult = document.getElementById("tvShows");
const searchResult = document.getElementById("searchResult");
const loadMoreBtn = document.getElementById("loadMoreBtn");
let page = 1;
let isSearching = false;

let searchTerm;

// Fetch JSON data from url
async function fetchData(url, mediaType) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data && data.results) {
      const filteredResults = data.results.filter(
        (result) => result.media_type === mediaType
      );
      showResults(filteredResults, mediaType);
    }
  } catch (error) {
    return null;
  }
}

// Fetch and show results based on url
async function fetchAndShowMovies(movieUrl) {
  await fetchData(movieUrl, "movie");
}

async function fetchAndShowTvShows(tvUrl) {
  await fetchData(tvUrl, "tv");
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


/******Importing genres from genres.js ******/
import { movieGenres, tvGenres } from './genres.js';

function createSearchCard(movie) {
  const {
    backdrop_path,
    poster_path,
    original_title,
    release_date,
    overview,
    id,
    media_type,
    genre_ids
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
  const genreNames = genre_ids.map(genreId => {
    const genre = movieGenres.find(genre => genre.id === genreId);
    return genre ? genre.name : '';
  }).join(', ');
      
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
    genre_ids
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
  const genreNames = genre_ids.map(genreId => {
    const genre = tvGenres.find(genre => genre.id === genreId);
    return genre ? genre.name : '';
  }).join(', ');


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
    movieResult.innerHTML = "";
    tvResult.innerHTML = "";
    searchResult.innerHTML = "";

}

// Show results in page
function showResults(item, mediaType) {
  const newContent = item
    .map(mediaType === "movie" ? createMovieCard : createTvCard)
    .join("");

  if (mediaType === "movie") {
    movieResult.innerHTML += newContent || "<p>No results found.</p>";
  } else if (mediaType === "tv") {
    tvResult.innerHTML += newContent || "<p>No results found.</p>";
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
  searchResult.innerHTML += searchContent || "<p>No results found.</p>";
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
    const trendingH1 = document.querySelectorAll("#trendingText");
    trendingH1.forEach((heading) => {
      heading.classList.add("hide-element");
    });
    const resultsText = document.getElementById("resultsText");
    movieResult.classList.add("hide-element");
    tvResult.classList.add("hide-element");

    searchResult.classList.remove("hide-element");
    // loadMoreBtn.style.display = "block";
    resultsText.classList.remove("hide-element");
    resultsText.innerText = "Showing results for: " + query.value;
    query.value = "";
    await fetchAndShowSearch(newUrl);
  }
}

// Load more results
async function loadMoreResults() {
  if (isSearching) {
    if (searchTerm) {
      page++;
      const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
      await fetchAndShowSearch(newUrl);
    }
  }
}

// Event listeners
form.addEventListener("submit", handleSearch);

// Initialize the page
async function init() {
  clearResults();
  const movieUrl = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${apiKey}&page=${page}`;
  const tvUrl = `https://api.themoviedb.org/3/trending/tv/day?language=en-US&api_key=${apiKey}&page=${page}`;
  isSearching = false;

  await fetchAndShowMovies(movieUrl);
  await fetchAndShowTvShows(tvUrl);
}

init();

// // Fetch JSON data from url
// async function fetchData(url) {
//     try {
//       const response = await fetch(url);
//       console.log(response)
//       if (!response.ok) {
//         throw new Error("Network response was not ok.");
//       }
//       return await response.json();
//     } catch (error) {
//       throw error; // Instead of returning null
//     }
//   }

// // Fetch and show results based on url
// async function fetchAndShowMovies(movieUrl) {
//     const data = await fetchData(movieUrl);
//     if (data && data.results) {
//       showResults(data.results);
//     }
//   }

// // Fetch and show results based on url
// async function fetchAndShowMovies(movieUrl) {
//   await fetchData(movieUrl);
// }
// // Create movie card html template
// function createMovieCard(movie) {
//   const {
//     backdrop_path,
//     poster_path,
//     original_title,
//     release_date,
//     overview,
//     id,
//     media_type,
//   } = movie;

//   const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
//   const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpeg";

//   const cardTemplate = `
//             <div class="movie-card card" data="${id}">
//               <img src="${imagePath}" alt="" />
//             </div>
//     `;

//   console.log(movie);
//   return cardTemplate;
// }

// // Show results in page
// function showResults(item) {
//   const newContent = item.map(createMovieCard).join("");
//   movieResult.innerHTML += newContent || "<p>No results found.</p>";
// }

// // Load more results
// async function loadMoreResults() {
//   if (isSearching) {
//     if (searchTerm) {
//       page++;
//       const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
//       await fetchAndShowMovies(newUrl);
//     }
//   }
// }

// // Initialize the page
// async function init() {
//   const movieUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
//   isSearching = false;

//   await fetchAndShowMovies(movieUrl);
// }

// init();
