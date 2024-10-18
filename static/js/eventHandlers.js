import { createVideoModal } from "./pageCreators.js";

function toggleSearchBar() {
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
      //Make the modal appear and play video when clicking on the video thumbnail
      createVideoModal(this);
    };
    playerElements[n].appendChild(div);
  }
}
// document.addEventListener('DOMContentLoaded', initYouTubeVideos);

export { initYouTubeVideos, toggleSearchBar };
