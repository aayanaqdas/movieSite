import { apiKey, imgApi } from "./main.js";
const imgApiPerson = "https://image.tmdb.org/t/p/w235_and_h235_face";

const infoSectionContainer = document.getElementById("info-section-container");

//reveal searchbar in infopage so its possible to search
const searchIcon = document.getElementById("searchIcon");
const xIcon = document.getElementById("xIcon");
const searchBar = document.getElementById("searchForm");

searchIcon.onclick = function () {
  searchIcon.classList.add("hide-element");
  xIcon.classList.remove("hide-element");
  searchBar.classList.remove("hide-element");
};

xIcon.onclick = function () {
  searchIcon.classList.remove("hide-element");
  xIcon.classList.add("hide-element");
  searchBar.classList.add("hide-element");
};

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

// Fetch JSON data from url
async function fetchInfoDataPerson(url) {
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
      showResults(data, "person");
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

async function fetchInfoPerson(url) {
  await fetchInfoDataPerson(url);
}

function showResults(item, mediaType) {
  if (mediaType === "movie") {
    const infoContent = createInfoPageMovie(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
  } else if (mediaType === "tv") {
    const infoContent = createInfoPageTv(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
  } else if (mediaType === "person") {
    const infoContent = createInfoPagePerson(item);
    infoSectionContainer.innerHTML = infoContent || "<p>No results found<p>";
  }
}

function createInfoPageMovie(movie) {
  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    overview,
    id,
    media_type,
    genres,
    vote_average,
    vote_count,
    runtime,
    tagline,
    production_companies,
    credits,
    recommendations,
    trailers,
  } = movie;

  const backDrop = backdrop_path
    ? imgApi + backdrop_path
    : "./images/no_image.svg";
  const poster = poster_path ? imgApi + poster_path : "./images/no_image.svg";

  const releaseYear = release_date.slice(0, 4) || "N/A";
  const releaseDate = release_date
    ? release_date.split("-").reverse().join("/")
    : "N/A";

  const rating = vote_average.toString().slice(0, 3) || "N/A";

  const runtimeHour = runtime > 60 ? runtime / 60 : "0";
  const runtimeMinute = runtime > 60 ? runtime % 60 : "0";

  const formatRuntime =
    runtimeHour.toString().slice(0, 1) +
    "h " +
    runtimeMinute.toString().slice(0, 2) +
    "m ";

  const productionCompanies = production_companies
    .map((company) => {
      return company ? company.name : "N/A";
    })
    .join(", ");

  const genreNames = genres
    .map((genre) => {
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const castHTML = credits.cast
    .map((castMember) => {
      return `
        <div class="cast-card" data-id="${castMember.id}">
        <a href="info.html?id=${castMember.id}&mediaType=person">
          <img src="${imgApiPerson + castMember.profile_path}" alt="${castMember.name}">
          </a>
          <div class="cast-info">
            <h3>${castMember.name}</h3>
            <p>${castMember.character.split('/').slice(0, 2).join('/')}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const cardTemplate = `

        <div class="info-section" data-id="${id}">
          <div class="poster_backdrop">
            <div class="info-backdrop">
              <img src="${backDrop}" alt="${title}" />
            </div>
            <div class="backdrop-gradient"></div>
            <div class="info-poster">
              <img src="${poster}" alt="${title}" />
            </div>
          </div>
        
          <div class="info-content">
            <div class="title_general-info">
              <div class="info-title">
                <h1>${title} <span class="year">(${releaseYear})</span></h1>
              </div>
              <div class="general-info">
              <div class="rating_runtime">
                <div class="rating">
                  <p class="star">
                    <i class="fa-solid fa-star" style="color: #ffd43b"></i
                    > <span class="rating-number">${rating}</span>/10
                  </p>
                </div>
                •
                <div class="runtime">${formatRuntime}</div>
              </div>
            <div class="genres">
              <p>${genreNames}</p>
            </div>
              </div>
            </div>

        
            <div class="tagline">
              <p>${tagline}</p>
            </div>
            <div class="info-overview">
              <h3 class="overview-header">Overview</h3>
              <p>${overview}</p>
            </div>

            <div class="release-date">
              <h3 class="release-date-header">Release Date</h3>
              <p>${releaseDate}</p>
            </div>

            <div class="production-companies">
              <h3 class="production-companies-header">Production Companies</h3>
              <p>${productionCompanies}</p>
            </div>

            <div class="cast-container">
              <h2>Cast</h2>
              <section id="castSection" class="contentSections">
              ${castHTML}
              </section>
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
    name,
    first_air_date,
    overview,
    id,
    media_type,
    genres,
    vote_average,
    vote_count,
    tagline,
    production_companies,
    number_of_seasons,
    credits
  } = tv;

  const backDrop = backdrop_path
    ? imgApi + backdrop_path
    : "./images/no_image.svg";
  const poster = poster_path ? imgApi + poster_path : "./images/no_image.svg";

  const releaseYear = first_air_date.slice(0, 4);
  const releaseDate = first_air_date
    ? first_air_date.split("-").reverse().join("/")
    : "N/A";

  const rating = vote_average.toString().slice(0, 3) || "N/A";

  const genreNames = genres
    .map((genre) => {
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const productionCompanies = production_companies
    .map((company) => {
      return company ? company.name : "N/A";
    })
    .join(", ");

    const castHTML = credits.cast
    .map((castMember) => {
      return `
        <div class="cast-card" data-id="${castMember.id}">
        <a href="info.html?id=${castMember.id}&mediaType=person">
          <img src="${imgApiPerson + castMember.profile_path}" alt="${castMember.name}">
          </a>
          <div class="cast-info">
            <h3>${castMember.name}</h3>
            <p>${castMember.character.split('/').slice(0, 2).join('/')}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const cardTemplate = `

        <div class="info-section" data-id="${id}">
          <div class="poster_backdrop">
            <div class="info-backdrop">
              <img src="${backDrop}" alt="${name}" />
            </div>
            <div class="backdrop-gradient"></div>
            <div class="info-poster">
              <img src="${poster}" alt="${name}" />
            </div>
          </div>
        
          <div class="info-content">
            <div class="title_general-info">
              <div class="info-title">
                <h1>${name} <span class="year">(${releaseYear})</span></h1>
              </div>
              <div class="general-info">
              <div class="rating_runtime">
                <div class="rating">
                  <p class="star">
                    <i class="fa-solid fa-star" style="color: #ffd43b"></i
                    > <span class="rating-number">${rating}</span>/10
                  </p>
                </div>
                •
                <div class="runtime">Seasons: ${number_of_seasons}</div>
              </div>
            <div class="genres">
              <p>${genreNames}</p>
            </div>
              </div>
            </div>

        
            <div class="tagline">
              <p>${tagline}</p>
            </div>
            <div class="info-overview">
              <h3 class="overview-header">Overview</h3>
              <p>${overview}</p>
            </div>

            <div class="release-date">
              <h3 class="release-date-header">Release Date</h3>
              <p>${releaseDate}</p>
            </div>

            <div class="production-companies">
              <h3 class="production-companies-header">Production Companies</h3>
              <p>${productionCompanies}</p>
            </div>
            <div class="cast-container">
              <h2>Cast</h2>
              <section id="castSection" class="contentSections">
              ${castHTML}
              </section>
            </div>
          </div>
        </div>

  
  `;

  return cardTemplate;
}

function createInfoPagePerson(person) {
  const {
    profile_path,
    name,
    known_for_department,
    biography,
    birthday,
    id,
    place_of_birth,
    gender,
  } = person;

  const profilePath = profile_path
    ? imgApiPerson + profile_path
    : "./images/no_image.svg";

  const departmentName = known_for_department ? known_for_department : "N/A";
  const genderName = gender === 2 ? "Male" : "Female" || "N/A";
  const birthdate = birthday ? birthday.split("-").reverse().join("/") : "N/A";
  const birthplace = place_of_birth ? place_of_birth : "N/A";
  const biographyContent = biography ? biography : "N/A";

  const cardTemplate = `
          <div class="person-info-section" data-id="${id}">
          <div class="name_image">
            <div class="person-image">
              <img
                src="${profilePath}"
                alt="${name}"
              />
            </div>
            <h1 class="person-name">${name}</h1>
          </div>
          <div class="personal-info">
            <h2>Personal Info</h2>
            <div class="known-for-department">
              <h4>Known For</h4>
              <p>${departmentName}</p>                
            </div>
            <div class="gender">
              <h4>Gender</h4>
              <p>${genderName}</p>
            </div>
            <div class="birthdate">
              <h4>Birthdate</h4>
              <p>${birthdate}</p>
            </div>
            <div class="birthplace">
              <h4>Place of birth</h4>
              <p>${birthplace}</p>
            </div>
          </div>
          <div class="biography">
            <h2>Biography</h2>
            ${biographyContent}
          </div>
          
          <div class="known-for-section">
            <h2 class="sectionHeadline"></h2>
            <div id="knownForContent" class="contentsections"></div>
          </div>
        </div>
        
        `;
  return cardTemplate;
}
//get media ID and mediaType from the url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const mediaType = urlParams.get("mediaType");

async function initInfoPage(id, mediaType) {
  if (mediaType === "tv") {
    const tvInfoUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits,trailers,recommendations,watch/providers`;
    await fetchInfoTv(tvInfoUrl);
  } else if (mediaType === "movie") {
    const movieInfoUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,trailers,recommendations,watch/providers`;
    await fetchInfoMovie(movieInfoUrl);
  } else if (mediaType === "person") {
    const personInfoUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`;
    await fetchInfoPerson(personInfoUrl);
  }
}

initInfoPage(id, mediaType);
