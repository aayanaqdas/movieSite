const watchlistSectionEl = document.getElementById('watchlistSection');
// localStorage.clear();

function updateWatchList() {
    const watchlistArray = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : [];
    const addToListBtns = document.querySelectorAll('.save-media-btn');

    // Remove existing event listeners
    addToListBtns.forEach((btn) => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });

    // Add new event listeners
    document.querySelectorAll('.save-media-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const mediaId = btn.dataset.id;
            const mediaPoster = btn.dataset.poster;
            const mediaType = btn.dataset.type;

            // Check if the media is already in the watchlist based on the ID
            if (watchlistArray.map((media) => media.id).includes(mediaId)) {
                removeMediaFromWatchlist(mediaId);
                console.log('This media is already in your watchlist');
            } else {
                btn.classList.add('active');
                console.log(`Save button clicked for ${mediaPoster} with ID ${mediaId}`);
                watchlistArray.push({ id: mediaId, poster: mediaPoster, mediaType: mediaType });
                localStorage.setItem('watchlist', JSON.stringify(watchlistArray));
                createWatchlistCards();
            }
        });

        if (watchlistArray.map((media) => media.id).includes(btn.dataset.id)) {
            btn.classList.add('active');
        }
    });
}

function createWatchlistCards() {
    const watchlistArray = localStorage.getItem('watchlist') ? JSON.parse(localStorage.getItem('watchlist')) : [];
    watchlistSectionEl.innerHTML = '';
    if (watchlistArray.length === 0) {
        watchlistSectionEl.innerHTML = '<p class="add-to-watchlist-text">Your watchlist is empty</p>';
    }
    const reversedWatchlist = watchlistArray.reverse(); // Reverse watchlist array so it shows the newly added first
    reversedWatchlist.forEach((media) => {
        const tvCardTemplate = `
            <div class="tv-card card" data-id="${media.id}">
                <button class="save-media-btn" data-id="${media.id}" data-poster="${media.poster}" data-type="tv"><i class="fa-solid fa-bookmark"></i></button>
                <a href="/info.html/tv/${media.id}">
                    <span class="tv-label">TV</span>
                    <img src="${media.poster}" alt="" />
                </a>
            </div>
        `;
        const movieCardTemplate = `
        <div class="movie-card card" data-id="${media.id}">
                <button class="save-media-btn" data-id="${media.id}" data-poster="${media.poster}" data-type="movie"><i class="fa-solid fa-bookmark"></i></button>
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

function removeMediaFromWatchlist(mediaId) {
    document.querySelectorAll('.save-media-btn').forEach((btn) => {
        if (btn.dataset.id === mediaId) {
            btn.classList.remove('active');
        }
    });
    const watchlistArray = JSON.parse(localStorage.getItem('watchlist'));
    const updatedWatchlistArray = watchlistArray.filter((media) => media.id !== mediaId);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlistArray));
    createWatchlistCards();
    updateWatchList();
}

export { updateWatchList, createWatchlistCards };
