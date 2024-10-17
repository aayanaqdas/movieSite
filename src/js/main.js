import { apiKey, fetchData } from "./api.js";
import { createMovieCard, createTvCard } from "./pageCreators.js";
import { handleSearch } from "./search.js";

const form = document.getElementById("searchForm");

const trendingResult = document.getElementById("trendingSection");
const popularMoviesResult = document.getElementById("popularMoviesSection");
const upcomingMoviesResult = document.getElementById("upcomingSection");
const topRatedTvResult = document.getElementById("topRatedTvSection");

let page = 1;
const dateToday = new Date().toISOString().slice(0, 10);
const language = navigator.languages[0];
const region = navigator.languages[0].substring(3);

async function fetchResults(url, type) {
  const data = await fetchData(url);
  if (data && data.results) {
    showResults(data.results, type);
  }
}

function showResults(items, type) {
  let newContent = "";
  if (type === "trendingData") {
    newContent = items
      .map((media) =>
        media.media_type === "movie"
          ? createMovieCard(media)
          : createTvCard(media)
      )
      .join("");
    trendingResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "popularMoviesData") {
    newContent = items.map(createMovieCard).join("");
    popularMoviesResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "topRatedTvData") {
    newContent = items.map(createTvCard).join("");
    topRatedTvResult.innerHTML = newContent || "<p>No results found.</p>";
  } else if (type === "upcomingMoviesData") {
    newContent = items.map(createMovieCard).join("");
    upcomingMoviesResult.innerHTML = newContent || "<p>No results found.</p>";
  }
}

async function init() {
  const trendingAllUrl = `https://api.themoviedb.org/3/trending/all/day?language=${language}&api_key=${apiKey}&page=${page}`;
  await fetchResults(trendingAllUrl, "trendingData");

  const popularMoviesUrl = `https://api.themoviedb.org/3/discover/movie?language=${language}&api_key=${apiKey}&page=${page}&sort_by=popularity.desc`;
  await fetchResults(popularMoviesUrl, "popularMoviesData");

  const topRatedTvUrl = `https://api.themoviedb.org/3/tv/top_rated?language=${language}&api_key=${apiKey}&page=${page}`;
  await fetchResults(topRatedTvUrl, "topRatedTvData");

  const upcomingMoviesUrl = `https://api.themoviedb.org/3/discover/movie?language=${language}&api_key=${apiKey}&page=${page}&primary_release_date.gte=${dateToday}&sort_by=popularity.desc`;
  await fetchResults(upcomingMoviesUrl, "upcomingMoviesData");
}

form.addEventListener("submit", handleSearch);

init();

