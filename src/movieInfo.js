import { apiKey, imgApi } from "./main.js";

const infoSectionContainer = document.getElementById("info-section-container");

// Fetch JSON data from url
async function fetchInfoDataMovie(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data) {
      // infoSectionContainer.innerHTML = "";
      showResults(data, "movie");
    }
  } catch (error) {
    return null;
  }
}

// Fetch JSON data from url
async function fetchInfoDataTv(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data) {
      // infoSectionContainer.innerHTML = "";
      showResults(data, "tv");
    }
  } catch (error) {
    return null;
  }
}

async function fetchInfoMovie(url) {
  await fetchInfoDataMovie(url);
}

async function fetchInfoTv(url) {
  await fetchInfoDataTv(url);
}

function showResults(item, mediaType) {
  if (mediaType === "movie") {
    const infoContent = createInfoPageMovie(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
  } else if (mediaType === "tv") {
    const infoContent = createInfoPageTv(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
  }
}

/******Importing genres from genres.js ******/
import { movieGenres, tvGenres } from "./genres.js";

function createInfoPageMovie(movie) {
  const {
    backdrop_path,
    poster_path,
    original_title,
    release_date,
    overview,
    id,
    media_type,
    genres,
    vote_average,
    vote_count,
    runtime,
  } = movie;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const year = release_date.slice(0, 4) || "N/A";
  const rating = vote_average.toString().slice(0, 3) || "N/A";

  const runtimeHour = runtime > 60 ? runtime / 60 : "0";
  const runtimeMinute = runtime > 60 ? runtime % 60 : "0";

  const formatRuntime =
    runtimeHour.toString().slice(0, 1) +
    "h " +
    runtimeMinute.toString().slice(0, 2) +
    "m ";

  const genreNames = genres
    .map((genre) => {
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const cardTemplate = `
       <div class="info-section" data-id="${id}">
          
          <div class="poster_backdrop">
            <img
              class="info-backdrop"
              src="${backDrop}"
              alt="${original_title}"
            />
            <img class="info-poster" src="${imagePath}" alt="${original_title}" />
          </div>

          <div class="info-content">
            <div class="title_general-info">
              <div class="info-title">
                <h1>${original_title} <span class="year">(${year})</span></h1>
                
              </div>
              <div class="general-info">
                <div class="rating">
                  <p class="star"><i class="fa-solid fa-star" style="color: #FFD43B;"></i>${rating}</p>
                </div>
                •
                <div class="runtime">${formatRuntime}</div>
                •
                <div class="genre">${genreNames}</div>
              </div>
            </div>

            <div class="info-overview">
              <h3 class="overview-header">Overview</h3>
              <p>
              ${overview}
              </p>
            </div>
          </div>
        </div>

        `;

  return cardTemplate;
}

function createInfoPageTv(tv) {
  const {
    backdrop_path,
    poster_path,
    original_name,
    first_air_date,
    overview,
    id,
    media_type,
    genres,
    vote_average,
    vote_count,
  } = tv;

  const backDrop = backdrop_path ? imgApi + backdrop_path : "./img-01.jpeg";
  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const year = first_air_date.slice(0, 4);
  const rating = vote_average.toString().slice(0, 3) || "N/A";

  const genreNames = genres
    .map((genre) => {
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const cardTemplate = `

       <div class="info-section" data-id="${id}">
          
          <div class="poster_backdrop">
            <img
              class="info-backdrop"
              src="${backDrop}"
              alt="${original_name}"
            />
            <img class="info-poster" src="${imagePath}" alt="${original_name}" />
          </div>

          <div class="info-content">
            <div class="title_general-info">
              <div class="info-title">
                <h1>${original_name}<span class="year"${year}</span></h1>
                
              </div>
              <div class="general-info">
                <div class="rating">
                  <p class="star"><i class="fa-solid fa-star" style="color: #FFD43B;"></i>${rating}</p>
                </div>
                •
                <div class="genre">${genreNames}</div>
              </div>
            </div>

            <div class="info-overview">
              <h3 class="overview-header">Overview</h3>
              <p>
              ${overview}
              </p>
            </div>
          </div>
        </div>

  
  `;

  return cardTemplate;
}
//get media ID and mediaType from the url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const mediaType = urlParams.get("mediaType");

initInfoPage(id, mediaType);
async function initInfoPage(id, mediaType) {
  if (mediaType === "tv") {
    const tvInfoUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`;
    await fetchInfoTv(tvInfoUrl);
  } else if (mediaType === "movie") {
    const movieInfoUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
    await fetchInfoMovie(movieInfoUrl);
  }
}
