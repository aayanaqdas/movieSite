const apiKey = "37d7e055234a0531d45416a1d56745eb";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=`;

const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const movieResult = document.getElementById("movies");
const tvResult = document.getElementById("tvShows");
const searchResult = document.getElementById("search-result");
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

// Clear result element for search
function clearResults() {
  const currentPagePath = document.location.pathname;
  if (currentPagePath.includes("index.html")) {
    movieResult.innerHTML = "";
    tvResult.innerHTML = "";
    searchResult.innerHTML = "";
  }
}

// Show results in page
function showResults(item, mediaType) {
  const newContent = item
    .map(mediaType === "movie" ? createMovieCard : createTvCard)
    .join("");
  if (isSearching) {
    searchResult.innerHTML += newContent || "<p>No results found.</p>";
  } else {
    if (mediaType === "movie") {
      movieResult.innerHTML += newContent || "<p>No results found.</p>";
    } else if (mediaType === "tv") {
      tvResult.innerHTML += newContent || "<p>No results found.</p>";
    }
  }
}
// Load more results
async function loadMoreResults() {
  if (isSearching) {
    if (searchTerm) {
      page++;
      const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
      await fetchAndShowMovies(newUrl);
      await fetchAndShowTvShows(newUrl);
    }
  }
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
    const trendingH1 = document.querySelectorAll(".trending-h1");
    trendingH1.forEach((heading) => {
      heading.classList.add("hide-element");
    });
    const resultsText = document.querySelector(".search-results-heading");
    movieResult.classList.add("hide-element");
    tvResult.classList.add("hide-element");
    searchResult.classList.remove("hide-element");
    loadMoreBtn.style.display = "block";
    resultsText.style.display = "block";
    resultsText.innerText = "Showing results for: " + query.value;
    query.value = "";
    await fetchAndShowMovies(newUrl);
    await fetchAndShowTvShows(newUrl);
  }
}

// Event listeners
// code to run only on the main page
if (document.body.id === "main-page") {
  form.addEventListener("submit", handleSearch);

  loadMoreBtn.addEventListener("click", () => {
    loadMoreResults();
  });
}

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
