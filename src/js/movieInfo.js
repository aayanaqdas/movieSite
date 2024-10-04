import { apiKey, imgApi, imgApiPerson } from "./apiKey.js";

const infoSectionContainer = document.getElementById("info-section-container");

//reveal searchbar in infopage so its possible to search
const searchIcon = document.getElementById("searchIcon");
const xIcon = document.getElementById("xIcon");
const searchBar = document.getElementById("searchForm");

const loader = document.getElementById("loader");

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

async function fetchCreditsInfoMovie(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data) {
      showResults(data, "movie/credits");
    }
  } catch (error) {
    return null;
  }
}

async function fetchCreditsInfoTv(url) {
  try {
    const response = await fetch(url);
    console.log(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    console.log(data);
    if (data) {
      showResults(data, "tv/credits");
    }
  } catch (error) {
    return null;
  }
}

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

  document.title = `${title} (${releaseYear}) | Info`;

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
    .slice(0, 20)
    .map((castMember) => {
      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      return `
        <div class="cast-card" data-id="${castMember.id}">
        <a href="info.html?id=${castMember.id}&mediaType=person">
          <img src="${profileImg}" alt="${castMember.name}">
          </a>
          <div class="cast-info">
            <h3>${castMember.name}</h3>
            <p>${castMember.character.split("/").slice(0, 2).join("/")}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const mediaHTML = trailers.youtube
    .map((media) => {
      return `
        <div class="youtube-player" data-id="${media.source}" data-name="${media.name}"></div>
      `;
    })
    .join("");

  const recommendationHTML = recommendations.results
    .map((media) => {
      const poster = media.poster_path
        ? imgApi + media.poster_path
        : "./images/no_image.svg";
      return `
    <a href="info.html?id=${media.id}&mediaType=movie">
        <div class="card" data-id="${media.id}">
          <img src="${poster}" alt="${media.name}" />

        </div>
    </a>
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
              <h2 class="cast-header">Top Cast <a href="info.html?id=${id}&mediaType=movie/credits" class="view-cast-text">View full cast and crew</a></h2>
              <section id="castSection" class="contentSections">
              ${
                castHTML ||
                '<p class="not-available">No cast available at this time</p>'
              }
              </section>
            </div>

        <div class="info-videos">
          <h2 class="sectionHeadline">Videos</h2>
          <section class="info-video-section">
          ${
            mediaHTML ||
            '<p class="not-available">No videos available at this time</p>'
          }
          </section>            
            </div>

        <div class="recommendations">
          <h2 class="sectionHeadline">Recommended</h2>
          <section class="contentSections">
          ${
            recommendationHTML ||
            '<p class="not-available">No recommendations available at this time</p>'
          }
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
    aggregate_credits,
    recommendations,
    videos,
  } = tv;

  const backDrop = backdrop_path
    ? imgApi + backdrop_path
    : "./images/no_image.svg";
  const poster = poster_path ? imgApi + poster_path : "./images/no_image.svg";

  const releaseYear = first_air_date.slice(0, 4);
  const releaseDate = first_air_date
    ? first_air_date.split("-").reverse().join("/")
    : "N/A";

  document.title = `${name} (${releaseYear}) | Info`;
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

  const castHTML = aggregate_credits.cast
    .slice(0, 20)
    .map((castMember) => {
      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      const roles = castMember.roles;
      const character = roles[0].character;
      return `
        <div class="cast-card" data-id="${castMember.id}">
          <a href="info.html?id=${castMember.id}&mediaType=person">
            <img src="${profileImg}" alt="${castMember.name}">
          </a>
          <div class="cast-info">
            <h3>${castMember.name}</h3>
            <p>${character.split("/").slice(0, 2).join("/")}</p>
          </div>
        </div>
      `;
    })
    .join("");

  const mediaHTML = videos.results
    .map((media) => {
      return `
    <div class="youtube-player" data-id="${media.key}" data-name="${media.name}"></div>
      `;
    })
    .join("");

  const recommendationHTML = recommendations.results
    .map((media) => {
      const poster = media.poster_path
        ? imgApi + media.poster_path
        : "./images/no_image.svg";
      return `
<a href="info.html?id=${media.id}&mediaType=tv">
        <div class="tv-card card" data-id="${media.id}">
          <span class="tv-label">TV</span>
          <img src="${poster}" alt="${media.name}" />

        </div>
  </a>
      `;
    })
    .join("");

  const pageTemplate = `

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
              <h2 class="cast-header">Series Cast <a href="info.html?id=${id}&mediaType=tv/credits" class="view-cast-text">View full cast and crew</a></h2>
              <section id="castSection" class="contentSections">
              ${
                castHTML ||
                '<p class="not-available">No cast available at this time</p>'
              }
              </section>
            </div>

        <div class="info-videos">
          <h2 class="sectionHeadline">Videos</h2>
          <section class="info-video-section">
          ${
            mediaHTML ||
            '<p class="not-available">No videos available at this time</p>'
          }
          </section>            
            </div>

        <div class="recommendations">
          <h2 class="sectionHeadline">Recommended</h2>
          <section class="contentSections">
          ${
            recommendationHTML ||
            '<p class="not-available">No recommendations available at this time</p>'
          }
          </section>            
            </div>
          </div>
        </div>

  
  `;

  return pageTemplate;
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

  document.title = `${name} | Info`;

  const profilePath = profile_path
    ? imgApiPerson + profile_path
    : "./images/no_person_img.svg";

  const departmentName = known_for_department ? known_for_department : "N/A";
  const genderName = gender === 2 ? "Male" : "Female" || "N/A";
  const birthdate = birthday ? birthday.split("-").reverse().join("/") : "N/A";
  const birthplace = place_of_birth ? place_of_birth : "N/A";
  const biographyFull = biography ? biography : "N/A";

  const biographyShort =
    biographyFull.length > 400 ? biographyFull.slice(0, 400) : biographyFull;
  const biographyMore = biographyFull.slice(400);

  const pageTemplate = `
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
        <div id="biography">
          <h2>Biography</h2>
      <p id="biography-short">${biographyShort}<span id='dots'>....</span>${
    biographyMore
      ? `<span id="biography-more" class="hide-element">${biographyMore}</span>`
      : ""
  }
  

  ${
    biographyMore
      ? `<span><button class="read-more-button">Read More</button></span>`
      : ""
  }</p>
            
          </div>
          
          <div class="known-for-section">
            <h2 class="sectionHeadline"></h2>
            <div id="knownForContent" class="contentsections"></div>
          </div>
        </div>
        
        `;

  document.getElementById("info-section-container").innerHTML = pageTemplate;

  //function to add read more button to biography if it exceeds 400 characters
  // Wait for the button to be rendered in the DOM
  setTimeout(function () {
    // Add event listener to the read more button
    const readMoreButtons = document.querySelectorAll(".read-more-button");
    const dots = document.getElementById("dots");
    dots.classList.add("hide-element");
    readMoreButtons.forEach((button) => {
      dots.classList.remove("hide-element");
      button.addEventListener("click", function () {
        const biographyMore = document.getElementById("biography-more");
        if (biographyMore.classList.contains("hide-element")) {
          dots.classList.add("hide-element");
          biographyMore.classList.remove("hide-element");
          button.textContent = "Read Less";
        } else {
          biographyMore.classList.add("hide-element");
          dots.classList.remove("hide-element");
          button.textContent = "Read More";
        }
      });
    });
  }, 100);

  return pageTemplate;
}

function createCreditsPageMovie(credits) {
  const { crew, cast } = credits;
  console.log(crew);

  document.title = `Crew and cast`;

  const castHTML = cast
    .map((castMember) => {
      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      return `
      <div class="credits-cast">
      <a href="info.html?id=${castMember.id}&mediaType=person">
        <div class="credits-cast-card">
            <img
                src="${profileImg}"
                alt=""
              />
          <div class="credits-cast-info">
              <h3>${castMember.name}</h3>
              <p>${castMember.character}</p>                
            </div>
            </div>
            </a>
          </div>
    `;
    })
    .join("");

  const crewHTML = crew
    .map((crewMember) => {
      const profileImg = crewMember.profile_path
        ? imgApiPerson + crewMember.profile_path
        : "./images/no_person_img.svg";

      return `
      <div class="credits-cast">
      <a href="info.html?id=${crewMember.id}&mediaType=person">
        <div class="credits-cast-card">
            <img
                src="${profileImg}"
                alt=""
              />
          <div class="credits-cast-info">
              <h3>${crewMember.name}</h3>
              <p>${crewMember.job}</p>                
            </div>
            </div>
            </a>
          </div>
    `;
    })
    .join("");

  const template = `
        <div class="credits-section">
          <h3 class="credits-cast-header">Cast <span class="total-cast-text">(${cast.length})</span></h3>
            ${castHTML}
          <h3 class="credits-cast-header">Crew <span class="total-cast-text">(${crew.length})</span></h3>
          ${crewHTML}
        </div>

      `;

  return template;
}

function createCreditsPageTv(aggregate_credits) {
  const { crew, cast } = aggregate_credits;
  console.log(crew);

  document.title = `Crew and cast`;

  const castHTML = cast
    .map((castMember) => {
      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      const roles = castMember.roles;
      const character = roles[0].character;
      return `
      <div class="credits-cast">
      <a href="info.html?id=${castMember.id}&mediaType=person">
        <div class="credits-cast-card">
            <img
                src="${profileImg}"
                alt=""
              />
          <div class="credits-cast-info">
              <h3>${castMember.name}</h3>
              <p>${character}</p>                
            </div>
            </div>
            </a>
          </div>
    `;
    })
    .join("");

  const crewHTML = crew
    .map((crewMember) => {
      const profileImg = crewMember.profile_path
        ? imgApiPerson + crewMember.profile_path
        : "./images/no_person_img.svg";
      const jobs = crewMember.jobs;
      const job = jobs[0].job;
      return `
      <div class="credits-cast">
      <a href="info.html?id=${crewMember.id}&mediaType=person">
        <div class="credits-cast-card">
            <img
                src="${profileImg}"
                alt=""
              />
          <div class="credits-cast-info">
              <h3>${crewMember.name}</h3>
              <p>${job}</p>                
            </div>
            </div>
            </a>
          </div>
    `;
    })
    .join("");

  const template = `
        <div class="credits-section">
          <h3 class="credits-cast-header">Series Cast <span class="total-cast-text">(${cast.length})</span></h3>
            ${castHTML}
          <h3 class="credits-cast-header">Crew <span class="total-cast-text">(${crew.length})</span></h3>
          ${crewHTML}
        </div>

      `;

  return template;
}

/***********Load thumbnail for youtube video and when clicked load the video **********/
//Create video frame
function createVideoModal(div) {
  const name =
    div.dataset.name.length > 32
      ? div.dataset.name.slice(0, 32) + "..."
      : div.dataset.name;
  const videoModalHTML = `
        <div id="videoModal" class="modal">
          <div class="modal-content">
            <div class="modal-title_close-btn">
              <h3>${name}</h3>
              <span class="close">&times;</span>
            </div>
            <div id="video">
              <iframe
                width="351"
                height="197"
                src="https://www.youtube.com/embed/${
                  div.dataset.id + "?autoplay=1"
                }"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
  `;
  const modalContainer = document.getElementById("videoModalContainer");
  modalContainer.style.display = "block";
  document.body.style.overflow = "hidden";
  modalContainer.innerHTML = videoModalHTML;

  const closeBtn = document.querySelector(".close");
  closeBtn.onclick = function () {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "none";
    document.body.style.overflow = "visible";
  };
}

function initYouTubeVideos() {
  var playerElements = document.querySelectorAll(".youtube-player");
  for (var n = 0; n < playerElements.length; n++) {
    var videoId = playerElements[n].dataset.id;
    var videoName = playerElements[n].dataset.name;
    var div = document.createElement("div");
    div.setAttribute("data-id", videoId);
    div.setAttribute("data-name", videoName);
    var thumbNode = document.createElement("img");
    thumbNode.src = "//i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", videoId);
    div.appendChild(thumbNode);
    var playButton = document.createElement("div");
    playButton.setAttribute("class", "play");
    div.appendChild(playButton);
    div.onclick = function () {
      //Make the frame appear when clicked
      createVideoModal(this);
    };
    playerElements[n].appendChild(div);
  }
}
// document.addEventListener('DOMContentLoaded', initYouTubeVideos);

//get media ID and mediaType from the url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const mediaType = urlParams.get("mediaType");

//get info from api requests
async function initInfoPage(id, mediaType) {
  if (mediaType === "tv") {
    const tvInfoUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=aggregate_credits,videos,recommendations,watch/providers`;
    await fetchInfoDataTv(tvInfoUrl);
  } else if (mediaType === "movie") {
    const movieInfoUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,trailers,recommendations,watch/providers`;
    await fetchInfoDataMovie(movieInfoUrl);
  } else if (mediaType === "person") {
    const personInfoUrl = `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits`;
    await fetchInfoDataPerson(personInfoUrl);
  }

  //get full media credits for cast and crew
  else if (mediaType === "movie/credits") {
    console.log("movie credits");
    const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
    await fetchCreditsInfoMovie(creditsUrl);
  } else if (mediaType === "tv/credits") {
    console.log("tv credits");
    const creditsUrl = `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${apiKey}`;
    await fetchCreditsInfoTv(creditsUrl);
  }

  initYouTubeVideos();
}

initInfoPage(id, mediaType);
