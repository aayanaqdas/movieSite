const watchlistSectionEl = document.getElementById("watchlistSection");

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

function getWatchlistFromDb(){
  fetch('/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userInfo.username })
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      userInfo.watchlist = result.watchlist;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      createWatchlistCards();
    } else {
      console.log(result.message);
    }
  });
}


async function updateWatchList() {
  const watchlistArray = userInfo.watchlist;
  const addToListBtns = document.querySelectorAll(".list-btn, .info-list-btn");

  // Remove existing event listeners
  addToListBtns.forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Add new event listeners
  document.querySelectorAll(".list-btn, .info-list-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const mediaId = btn.dataset.id;
      const mediaTitle = btn.dataset.name;
      const mediaPoster = btn.dataset.poster;
      const mediaType = btn.dataset.type;

      const mediaItem = {
        id: mediaId,
        title: mediaTitle,
        poster: mediaPoster,
        mediaType: mediaType,
      };

      // Check if the media is already in the watchlist based on the ID
      if (watchlistArray.map((media) => media.id).includes(mediaId)) {
        await removeMediaFromWatchlistDb(mediaId);
        console.log("This media is already in your watchlist");
      } else {
        btn.classList.add("active");
        console.log(
          `Save button clicked for ${mediaPoster} with ID ${mediaId}`
        );
        watchlistArray.push(mediaItem);
        userInfo.watchlist = watchlistArray;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        await addMediaToWatchlistDb(mediaItem);
        createWatchlistCards();
      }
    });

    if (watchlistArray.map((media) => media.id).includes(btn.dataset.id)) {
      btn.classList.add("active");
    }
  });
}

async function addMediaToWatchlistDb(mediaItem) {
  const response = await fetch('/watchlist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userInfo.username, media_item: mediaItem })
  });

  const result = await response.json();
  if (result.status === 'success') {
    userInfo.watchlist = result.watchlist;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } else {
    console.log(result.message);
  }
}

async function removeMediaFromWatchlistDb(mediaId) {
  const response = await fetch('/watchlist/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userInfo.username, media_id: mediaId })
  });

  const result = await response.json();
  if (result.status === 'success') {
    document.querySelectorAll(".list-btn, .info-list-btn").forEach((btn) => {
      if (btn.dataset.id === mediaId) {
        btn.classList.remove("active");
      }
    });
    userInfo.watchlist = result.watchlist;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    createWatchlistCards();
  } else {
    console.log(result.message);
  }
}

function createWatchlistCards() {
  if (window.location.pathname === "/") {
    const watchlistArray = userInfo.watchlist || [];

    watchlistSectionEl.innerHTML = "";
    if (watchlistArray.length === 0) {
      watchlistSectionEl.innerHTML =
        '<p class="add-to-watchlist-text">Your watchlist is empty</p>';
    }
    const reversedWatchlist = [...watchlistArray].reverse(); // Reverse watchlist array so it shows the newly added first
    reversedWatchlist.forEach((media) => {
      const tvCardTemplate = `
            <div class="tv-card card" data-id="${media.id}">
                <button class="list-btn" data-id="${media.id}" data-poster="${media.poster}" data-type="tv"><i class="fa-solid fa-bookmark"></i></button>
                <a href="/info.html/tv/${media.id}">
                    <span class="tv-label">TV</span>
                    <img src="${media.poster}" alt="" />
                </a>
            </div>
        `;
      const movieCardTemplate = `
        <div class="movie-card card" data-id="${media.id}">
                <button class="list-btn" data-id="${media.id}" data-poster="${media.poster}" data-type="movie"><i class="fa-solid fa-bookmark"></i></button>
            <a href="/info.html/movie/${media.id}">
                <img src="${media.poster}" alt="" />
            </a>
        </div>
    `;

      if (media.mediaType === "tv") {
        watchlistSectionEl.innerHTML += tvCardTemplate;
      } else if (media.mediaType === "movie") {
        watchlistSectionEl.innerHTML += movieCardTemplate;
      }
      updateWatchList();
    });
  }
}


function initWatchlist() {
  const loggedIn = userInfo.loggedIn;
  if (loggedIn) {
    getWatchlistFromDb();
    createWatchlistCards();
    updateWatchList();
  } else {
    userInfo.watchlist = [];
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    watchlistSectionEl.innerHTML =
      '<p class="add-to-watchlist-text">Please login to view your watchlist</p>';
    console.log("Login to use watchlist feature");
  }
}

export { initWatchlist };

// function removeMediaFromWatchlist(mediaId) {
//   document.querySelectorAll(".list-btn, .info-list-btn").forEach((btn) => {
//     if (btn.dataset.id === mediaId) {
//       btn.classList.remove("active");
//     }
//   });
//   const watchlistArray = userInfo.watchlist || [];
//   const updatedWatchlistArray = watchlistArray.filter(
//     (media) => media.id !== mediaId
//   );
//   userInfo.watchlist = updatedWatchlistArray;
//   localStorage.setItem("userInfo", JSON.stringify(userInfo));
//   createWatchlistCards();
//   updateWatchList();
// }