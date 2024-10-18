import { imgApiPerson, imgApi } from "./api.js";
import { movieGenres, tvGenres } from "./genres.js";

/**********Landing page cards*******/
// Create movie card html template
function createMovieCard(movie) {
  const {
    poster_path,
    id,
    name
  } = movie;

  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const cardTemplate = `
  <a href="info.html?id=${id}&mediaType=movie">
          <div class="movie-card card" data-id="${id}">
            <img src="${imagePath}" alt="${name}" />
        </div>
    </a>
  
      `;
    
  return cardTemplate;
}

// Create tv-show card html template
function createTvCard(tv) {
  const {
    poster_path,
    original_name,
    id,
  } = tv;

  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const cardTemplate = `
  <a href="info.html?id=${id}&mediaType=tv">
          <div class="tv-card card" data-id="${id}">
            <span class="tv-label">TV</span>
            <img src="${imagePath}" alt="${original_name}" />
  
          </div>
    </a>
      `;

  return cardTemplate;
}

/**********Search page cards*******/
function createSearchCard(movie) {
  const { poster_path, title, release_date, overview, id, genre_ids } = movie;

  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const searchTitle = title.length > 25 ? title.slice(0, 25) + "..." : title;
  const formattedDate =
    release_date.length > 4 ? release_date.slice(0, 4) : release_date || "N/A";
  const year = formattedDate.slice(0, 4);

  const description =
    overview.length > 110 ? overview.slice(0, 110) + "... " : "N/A";

  // Get genre_ids from api and Map genre IDs to their names which is located in genres.js
  const genreNames = genre_ids
    .map((genreId) => {
      const genre = movieGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "N/A";
    })
    .join(", ");

  const cardTemplate = `
    <a href="info.html?id=${id}&mediaType=movie">
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
  const { poster_path, name, first_air_date, overview, id, genre_ids } = tv;

  const imagePath = poster_path
    ? imgApi + poster_path
    : "./images/no_image.svg";

  const searchTitle = name.length > 31 ? name.slice(0, 29) + "..." : name;
  const formattedDate =
    first_air_date.length > 4
      ? first_air_date.slice(0, 4)
      : first_air_date || "N/A";
  const year = formattedDate.slice(0, 4);

  const description =
    overview.length > 110 ? overview.slice(0, 110) + "... " : "N/A";

  // Get genre_id from api and Map genre IDs to their names which are located in genres.js
  const genreNames = genre_ids
    .map((genreId) => {
      const genre = tvGenres.find((genre) => genre.id === genreId);
      return genre ? genre.name : "";
    })
    .join(", ");

  const cardTemplate = `

    <a href="info.html?id=${id}&mediaType=tv"">

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

function createSearchCardPerson(person) {
  const {
    profile_path,
    name,
    id,
    known_for,
    known_for_department,
    media_type,
  } = person;

  const profilePoster = profile_path
    ? imgApi + profile_path
    : "./images/no_image.svg";

  const knownFor = known_for
    .map((knownFor) => {
      return knownFor ? knownFor.title : "N/A";
    })
    .join(", ");

  const cardTemplate = `

    <a href="info.html?id=${id}&mediaType=person">

    <div class="search-card" data-id="${id}">
    <img src="${profilePoster}" alt="" />
    <div class="search-card-text">
      <h3 class="search-card-title">${name}</h3>
      <p class="search-card-info">Department: ${known_for_department}</p>
      <p class="search-card-overview">
          Known for: ${knownFor}
      </p>
    </div>
  </div>
  
</a>

  
  `;

  return cardTemplate;
}

/******Info page ******/
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
    videos,
    images,
  } = movie;

  const backDrop = backdrop_path
    ? imgApi + backdrop_path
    : "./images/no_image.svg";
  const poster = poster_path ? imgApi + poster_path : "./images/no_image.svg";

  const releaseYear = release_date.slice(0, 4) || "N/A";
  const releaseDate = release_date
    ? release_date.split("-").reverse().join("/")
    : "N/A";

  document.title = `${title} (${releaseYear}) - Info`;

  const rating = vote_average.toString().slice(0, 3) || "N/A";
  const voteCountString = vote_count.toString();
  const voteCount =
    voteCountString.length > 3
      ? (voteCountString / 1000).toFixed(1) + "k"
      : voteCountString;
  console.log(vote_count);

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
            <div class="poster_general-info">
            <div class="info-poster">
              <img src="${poster}" alt="${title}" />
              <div class="general-info">
                <h3 class="info-title">${title}</h3>
                <div class="info">
                  <p class="info-release-date">${releaseYear}</p>
                  •
                  <p class="runtime">${formatRuntime}</p>
                </div>
                
                <div class="genres">
                  <p>${genreNames}</p>
                </div>
                <div class="rating">
                  <p class="star">
                    <i class="fa-solid fa-star" style="color: #ffd43b"></i
                    > <span class="rating-number">${rating}</span><span class="total-stars">/10 (${voteCount})</span></p>
                </div>
              </div>
            </div>              
            </div>

          </div>
        
          <div class="info-content">
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

  document.title = `${name} (${releaseYear}) - Info`;

  const rating = vote_average.toString().slice(0, 3) || "N/A";

  const voteCountString = vote_count.toString();
  const voteCount =
    voteCountString.length > 3
      ? (voteCountString / 1000).toFixed(1) + "k"
      : voteCountString;
  console.log(vote_count);
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
            <div class="poster_general-info">
            <div class="info-poster">
              <img src="${poster}" alt="${name}" />
              <div class="general-info">
                <h3 class="info-title">${name}</h3>
                <div class="info">
                  <p class="info-release-date">${releaseYear}</p>
                  •
                  <p class="runtime">${"Seasons: " + number_of_seasons}</p>
                </div>
                
                <div class="genres">
                  <p>${genreNames}</p>
                </div>
                <div class="rating">
                  <p class="star">
                    <i class="fa-solid fa-star" style="color: #ffd43b"></i
                    > <span class="rating-number">${rating}</span><span class="total-stars">/10 (${
    voteCount || 0
  })</span></p>
                </div>
              </div>
            </div>              
            </div>

          </div>
        
          <div class="info-content">
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
              <h2 class="cast-header">Top Cast <a href="info.html?id=${id}&mediaType=tv/credits" class="view-cast-text">View full cast and crew</a></h2>
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
    combined_credits,
  } = person;

  document.title = `${name} - Info`;

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

  // Sort combined_credits.cast by user vote count in descending order
  const sortByVote = combined_credits.cast.sort((a, b) => b.vote_count - a.vote_count);

  // Filter out duplicates based on media id
  const filteredCredits = [];
  const mediaId = new Set();

  for (const media of sortByVote) {
    if (!mediaId.has(media.id)) {
    mediaId.add(media.id);
    filteredCredits.push(media);
    }
  }

  const knownForHTML = filteredCredits.slice(0, 30).map((media) => {
    const poster = media.poster_path
      ? imgApi + media.poster_path
      : "./images/no_image.svg";
      if(media.media_type === "movie"){
        return `
        <a href="info.html?id=${media.id}&mediaType=movie">
            <div class="card" data-id="${media.id}">
              <img src="${poster}" alt="${media.name}" />
            </div>
            <p class="known-for-character">${media.character}</p>
        </a>`;
      }
      else{
        return `
        <a href="info.html?id=${media.id}&mediaType=tv">
            <div class="tv-card card" data-id="${media.id}">
              <span class="tv-label">TV</span>
              <img src="${poster}" alt="${media.name}" />
            </div>
            <p class="known-for-character">${media.character}</p>
      </a>
          `;
      }
  }).join("");

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

  <div class="known-for-container">
      <section class="known-for-media">
        <h2 class="sectionHeadline">Known For</h2>
      <section id="knownForSection">
          ${
            knownForHTML ||
            '<p class="not-available">Not available at this time</p>'
          }      
      </section>
    </section>
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

    const restCast = cast.slice(300, cast.length)
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
      <div class="changeResultTypes">
        <button id="loadCast" class="resultTypeButton active">Cast: ${cast.length}</button>
        <button id="loadCrew" class="resultTypeButton">Crew: ${crew.length}</button>
      </div>
      <h3 class="credits-cast-header">Cast</h3>
        <div class="credits-cast-container">
        ${castHTML}
        </div>
        <div class="load-more-btn-container"> 
          <button id="loadMoreBtn">Load All</button>
        </div>
      </div>
      
  `;
        setTimeout(function () {
          // Add event listener to the load more button
          const loadMoreBtn = document.getElementById("loadMoreBtn");
          let divCount = document.querySelectorAll(".credits-cast").length;
          const creditsContainerEl = document.querySelector(".credits-cast-container");
          const loadCrewBtn = document.getElementById("loadCrew");
          const loadCastBtn = document.getElementById("loadCast");
          console.log(divCount);
        if(cast.length > 300 && divCount !== cast.length && loadCastBtn.classList.contains("active")){
            loadMoreBtn.style.display = "block";
            loadMoreBtn.addEventListener("click", function () {
              creditsContainerEl.innerHTML += restCast;
              divCount = document.querySelectorAll(".credits-cast").length;
              divCount === cast.length ? loadMoreBtn.style.display = "none" : loadMoreBtn.style.display = "block";
            console.log(divCount);
            })
          }
          else{
            loadMoreBtn.style.display = "none";
          }
          const creditsHeader = document.querySelector(".credits-cast-header");
          loadCrewBtn.addEventListener("click", function () {
            document.querySelector(".credits-cast-container").innerHTML = crewHTML;
            creditsHeader.textContent = "Crew";
            loadCrewBtn.classList.add("active");
            loadCastBtn.classList.remove("active");
            loadMoreBtn.style.display = "none";
          });
          loadCastBtn.addEventListener("click", function () {
            document.querySelector(".credits-cast-container").innerHTML = castHTML;
            creditsHeader.textContent = "Series Cast";
            loadCrewBtn.classList.remove("active");
            loadCastBtn.classList.add("active");
            loadMoreBtn.style.display = "block";
          });
        }, 200);
  return template;
}

function createCreditsPageTv(aggregate_credits) {
  const { crew, cast } = aggregate_credits;
  console.log(crew);

  document.title = `Crew and cast`;

  const castHTML = cast.slice(0, 300)
    .map((castMember) => {
      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      const roles = castMember.roles;
      const character = roles[0].character;
      const totalEpisodes = castMember.total_episode_count;

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
                <p>${character} <span class = "credits-episode-count">(${totalEpisodes + " episodes"})</span></p>           
              </div>
              </div>
              </a>
            </div>
      `;
    })
    .join("");

    const restCast = cast.slice(300, cast.length)
    .map((castMember) => {

      const profileImg = castMember.profile_path
        ? imgApiPerson + castMember.profile_path
        : "./images/no_person_img.svg";
      const roles = castMember.roles;
      const character = roles[0].character;
      const totalEpisodes = castMember.total_episode_count;
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
                <p>${character} <span class = "credits-episode-count">(${totalEpisodes + " episodes"})</span></p>           
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
            <div class="changeResultTypes">
              <button id="loadCast" class="resultTypeButton active">Cast: ${cast.length}</button>
              <button id="loadCrew" class="resultTypeButton">Crew: ${crew.length}</button>
            </div>
            <h3 class="credits-cast-header">Series Cast</h3>
              <div class="credits-cast-container">
              ${castHTML}
              </div>
              <div class="load-more-btn-container"> 
                <button id="loadMoreBtn">Load All</button>
              </div>
            </div>
            
        `;

    setTimeout(function () {
          // Add event listener to the load more button
          const loadMoreBtn = document.getElementById("loadMoreBtn");
          let divCount = document.querySelectorAll(".credits-cast").length;
          const creditsContainerEl = document.querySelector(".credits-cast-container");
          const loadCrewBtn = document.getElementById("loadCrew");
          const loadCastBtn = document.getElementById("loadCast");
          console.log(divCount);
        if(cast.length > 300 && divCount !== cast.length && loadCastBtn.classList.contains("active")){
            loadMoreBtn.style.display = "block";
            loadMoreBtn.addEventListener("click", function () {
              creditsContainerEl.innerHTML += restCast;
              divCount = document.querySelectorAll(".credits-cast").length;
              divCount === cast.length ? loadMoreBtn.style.display = "none" : loadMoreBtn.style.display = "block";
            console.log(divCount);
            })
          }
          else{
            loadMoreBtn.style.display = "none";
          }
          const creditsHeader = document.querySelector(".credits-cast-header");
          loadCrewBtn.addEventListener("click", function () {
            document.querySelector(".credits-cast-container").innerHTML = crewHTML;
            creditsHeader.textContent = "Crew";
            loadCrewBtn.classList.add("active");
            loadCastBtn.classList.remove("active");
            loadMoreBtn.style.display = "none";
          });
          loadCastBtn.addEventListener("click", function () {
            document.querySelector(".credits-cast-container").innerHTML = castHTML;
            creditsHeader.textContent = "Series Cast";
            loadCrewBtn.classList.remove("active");
            loadCastBtn.classList.add("active");
            loadMoreBtn.style.display = "block";
          });
        }, 200);
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

export {
  createMovieCard,
  createTvCard,
  createSearchCard,
  createSearchCardTv,
  createSearchCardPerson,
  createInfoPageMovie,
  createInfoPageTv,
  createInfoPagePerson,
  createCreditsPageMovie,
  createCreditsPageTv,
  createVideoModal,
};
