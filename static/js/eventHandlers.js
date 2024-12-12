import { createVideoModal } from "./pageCreators.js";



function toggleSettingsMenu(){
  const userSettingsIcon = document.getElementById("userSettingsIcon");
  const xIcon = document.getElementById("closeSettingsIcon");
  const settingsMenu = document.getElementById("settingsMenu");
  userSettingsIcon.onclick = function (){
    document.body.classList.toggle("lock-scroll")    
    settingsMenu.classList.toggle("hide-element");
    settingsMenu.classList.toggle("show-menu");    


  }
  xIcon.onclick = function (){
    document.body.classList.toggle("lock-scroll")    
    settingsMenu.classList.toggle("hide-element");
    settingsMenu.classList.toggle("show-menu");    


  }
}

//Function to show a video thumbnail and only loading the video when clicked. 
function initYouTubeVideos() {
  var playerElements = document.querySelectorAll(".youtube-player");
  for (var n = 0; n < playerElements.length; n++) {
    var videoId = playerElements[n].dataset.id;
    var videoName = playerElements[n].dataset.name;
    var div = document.createElement("div");
    div.setAttribute("data-id", videoId);
    div.setAttribute("data-name", videoName);
    var thumbNode = document.createElement("img");
    //Get the thumbnail images
    thumbNode.src = "//i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", videoId);
    div.appendChild(thumbNode);
    var playButton = document.createElement("div");
    playButton.setAttribute("class", "play");
    div.appendChild(playButton);
    div.onclick = function () {
      //Make the modal appear and play video when clicking on the video thumbnail
      //Function is in pageCreators.js
      createVideoModal(this);
    };
    playerElements[n].appendChild(div);
  }
}
// document.addEventListener('DOMContentLoaded', initYouTubeVideos);

export { initYouTubeVideos, toggleSettingsMenu };
