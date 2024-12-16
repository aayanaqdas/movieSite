import { createVideoModal } from "./pageCreators.js";


// Function to toggle the settings menu visibility
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

  // Loop through all the elements with the class youtube-player
  for (var n = 0; n < playerElements.length; n++) {
    var videoId = playerElements[n].dataset.id;
    var videoName = playerElements[n].dataset.name;

    // Create a div element for the video thumbnail
    var div = document.createElement("div");
    div.setAttribute("data-id", videoId);
    div.setAttribute("data-name", videoName);

    // Create an image element for the thumbnail
    var thumbNode = document.createElement("img");
    //Get the thumbnail images
    thumbNode.src = "//i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", videoId);
    div.appendChild(thumbNode);

    // Create a play button for the thumbnail
    var playButton = document.createElement("div");
    playButton.setAttribute("class", "play");
    div.appendChild(playButton);

    // Add an onclick event to the div and show the video modal
    div.onclick = function () {
      //Make the modal appear and play video when clicking on the video thumbnail
      //Function is in pageCreators.js
      createVideoModal(this);
    };

    // Append the div to the playerElements
    playerElements[n].appendChild(div);
  }
}
// document.addEventListener('DOMContentLoaded', initYouTubeVideos);

export { initYouTubeVideos, toggleSettingsMenu };
