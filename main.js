const apiKey = "37d7e055234a0531d45416a1d56745eb";
const imgApi = "https://image.tmdb.org/t/p/w1280";

const trendingResult = document.getElementById("trendingSection");
const popularMoviesResult = document.getElementById("popularMoviesSection");
const upcomingMoviesResult = document.getElementById("upcomingSection");
const topRatedTvResult = document.getElementById("topRatedTvSection");

const searchResult = document.getElementById("searchResult");
const loadMoreBtn = document.getElementById("loadMoreBtn");
let page = 1;

let dateToday = new Date().toISOString().slice(0, 10);


export{apiKey, imgApi};

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


async function fetchPopularMoviesData(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data && data.results) {
      showResults(data.results, "popularMoviesData");
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

async function fetchPopularMovies(url) {
  await fetchPopularMoviesData(url);
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
  } else if (type === "popularMoviesData") {
    const newContent = items.map(createMovieCard).join("");
    popularMoviesResult.innerHTML += newContent || "<p>No results found.</p>";

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
  const imagePath = poster_path ? imgApi + poster_path : "/images/no_image.svg";

  const cardTemplate = `
              <div class="movie-card card" data-id="${id}">
              <img src="${imagePath}" alt="" />
            </div>
    `;

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
  const imagePath = poster_path ? imgApi + poster_path : "/images/no_image.svg";

  const cardTemplate = `
            <div class="tv-card card" data-id="${id}">
              <span class="tv-label">TV</span>
              <img src="${imagePath}" alt="" />
            </div>

    `;

  return cardTemplate;
}

  // Clear result element for search
  function clearResults() {
    trendingResult.innerHTML = "";
    popularMoviesResult.innerHTML = "";
    topRatedTvResult.innerHTML = "";
    upcomingMoviesResult.innerHTML = "";
    searchResult.innerHTML = "";
    page = 1;
  }
  



// Initialize the page
async function init() {
  clearResults();
  
  const trendingAllUrl = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}&page=${page}`;
  await fetchTrendingAll(trendingAllUrl);

  const popularMoviesUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&api_key=${apiKey}&page=${page}&sort_by=popularity.desc`;
  await fetchPopularMovies(popularMoviesUrl);

  const topRatedTvUrl = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&api_key=${apiKey}&page=${page}`;
  await fetchTopRatedTv(topRatedTvUrl);

  const upcomingMoviesUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&api_key=${apiKey}&page=${page}&primary_release_date.gte=${dateToday}&sort_by=popularity.desc`;
  await fetchUpcomingMovies(upcomingMoviesUrl);
}

init();
